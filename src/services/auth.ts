import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import {
    ApiConflictError,
    ApiInvalidAuthenticationError,
    ApiSignInCredentialsError,
} from '@api-modules/errors';

import { UserRepository } from 'repositories/user';
import { PasswordService, UserService } from 'services/index';
import { IResponseMessage, ISignUpUserDto, IUserDto, IUserModel } from 'types/interfaces';

class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
    ) {}

    async signUp(req: Request): Promise<IUserDto> {
        const user: ISignUpUserDto = req.body;
        const existedUser = await this.userRepository.getByUsernameOrEmail({
            email: user.email,
            username: user.username,
        });

        if (existedUser) {
            throw new ApiConflictError({
                resourceName: 'user',
                resourceId: user.email === existedUser.email ? user.email : user.username,
            });
        }

        const passwordHash = await this.passwordService.hash(user.password);
        const salt = await this.passwordService.getSalt();
        const newUser = await this.userRepository.create({
            username: user.username,
            email: user.email,
            hash: passwordHash,
            salt,
        });

        return await new Promise((resolve, reject) => {
            req.login(newUser, (err) => {
                if (err) {
                    reject(new ApiInvalidAuthenticationError());
                }

                resolve(this.userService.mapModelToDto(newUser));
            });
        });
    }

    async signIn(req: Request, res: Response, next: NextFunction): Promise<IUserDto> {
        return await new Promise((resolve, reject) => {
            passport.authenticate('local', (err: ApiSignInCredentialsError, user: IUserModel) => {
                if (err || !user) {
                    reject(err);
                }

                req.login(user, (err) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(this.userService.mapModelToDto(user));
                });
            })(req, res, next);
        });
    }

    async signOut(req: Request): Promise<IResponseMessage> {
        return await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(err);
                }

                resolve({ message: 'You have been signed out' });
            });
        });
    }
}

export default AuthService;
