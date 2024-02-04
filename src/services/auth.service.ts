import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Service } from 'typedi';
import {
    ApiConflictError,
    ApiInvalidAuthenticationError,
    ApiSignInCredentialsError,
} from '@api-modules/errors';

import config from 'config/config';
import { UserRepository } from 'repositories/user.repository';
import { ISignUpUserInput, IUserDto, IUserModel } from 'types/interfaces';

// It's important to import the services with relative paths due "typedi" dependency injection order
import { CookieService } from './cookie.service';
import { UserService } from './user.service';

export interface IResponseMessage {
    message: string;
}

@Service()
class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,
        private readonly cookieService: CookieService,
    ) {}

    async signUp(req: Request): Promise<IUserDto> {
        const user: ISignUpUserInput = req.body;
        const existedUser = await this.userRepository.findByUsernameOrEmail({
            email: user.email,
            username: user.username,
        });

        if (existedUser) {
            throw new ApiConflictError({
                resourceName: 'user',
                resourceId: user.email === existedUser.email ? user.email : user.username,
            });
        }

        const newUser = await this.userService.createUser(user);

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

    async googleCallback(req: Request, res: Response, next: NextFunction): Promise<IUserDto> {
        return await new Promise((_, reject) => {
            passport.authenticate('google', (err: ApiSignInCredentialsError, user: IUserModel) => {
                if (err || !user) {
                    reject(err);
                }

                req.login(user, (err) => {
                    if (err) {
                        reject(err);
                    }

                    res.redirect(config.CLIENT_ORIGIN);
                });
            })(req, res, next);
        });
    }

    async signOut(req: Request, res: Response): Promise<IResponseMessage> {
        return await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(err);
                }
                res.clearCookie(this.cookieService.getName());

                resolve({ message: 'You have been signed out' });
            });
        });
    }
}

export { AuthService };
