import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { Profile as FacebookProfile } from 'passport-facebook';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Service } from 'typedi';
import {
    ApiAccessDeniedError,
    ApiConflictError,
    ApiInvalidAuthenticationError,
    ApiSignInCredentialsError,
} from '@api-modules/errors';
import { Logger } from '@api-modules/services';

import config from 'config/config';
import { UserRepository } from 'repositories/user.repository';
import { ISignUpUserInput, IUserDto, IUserModel } from 'types/interfaces';

// It's important to import the services with relative paths due "typedi" dependency injection order
import { CookieService } from './cookie.service';
import { PasswordService } from './password.service';
import { UserService } from './user.service';

const logger = new Logger();

export interface IResponseMessage {
    message: string;
}

@Service()
class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private readonly cookieService: CookieService,
    ) {
        this.verifyUser = this.verifyUser.bind(this);
        this.verifyGoogleUser = this.verifyGoogleUser.bind(this);
        this.verifyFacebookUser = this.verifyFacebookUser.bind(this);
    }

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

    async googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        return await new Promise((_, reject) => {
            passport.authenticate('google', (err: ApiSignInCredentialsError, user: IUserModel) => {
                if (err || !user) {
                    reject(err);
                }

                req.login(user, (err) => {
                    if (err) {
                        reject(err);
                    }

                    if (!res.headersSent) {
                        res.redirect(config.CLIENT_ORIGIN);
                    }
                });
            })(req, res, next);
        });
    }

    async facebookSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        return await new Promise((_, reject) => {
            passport.authenticate(
                'facebook',
                (err: ApiSignInCredentialsError, user: IUserModel) => {
                    console.log('login user', user);
                    if (err || !user) {
                        reject(err);
                    }

                    req.login(user, (err) => {
                        console.log('login user 2', user);
                        if (err) {
                            reject(err);
                        }

                        if (!res.headersSent) {
                            res.redirect(config.CLIENT_ORIGIN);
                        }
                    });
                },
            )(req, res, next);
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

    async verifyUser(
        emailOrUsername: string,
        password: string,
        done: (error: any, user?: IUserModel) => void,
    ) {
        try {
            const user = await this.userRepository.findByUsernameOrEmail({
                email: emailOrUsername,
                username: emailOrUsername,
            });

            if (!user) {
                return done(new ApiSignInCredentialsError());
            }

            const isValidPassword = await this.passwordService.compare(password, user.hash);
            if (!isValidPassword) {
                return done(new ApiSignInCredentialsError());
            }

            const accessTypeVerificationResult = this.userService.verifyAccessType(user.accessType);
            if (!accessTypeVerificationResult.isAllowed) {
                return done(
                    new ApiAccessDeniedError({
                        message: `Your account is ${accessTypeVerificationResult.status}`,
                    }),
                );
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }

    async verifyGoogleUser(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: (error: any, user?: IUserModel) => void,
    ) {
        try {
            const existedUser = await this.userRepository.findByOriginId(profile.id);

            if (!existedUser) {
                logger.info('Google user does not exist. Creating new user');
                const newUser = await this.userService.createGoogleUser(profile);

                return done(null, newUser);
            }

            logger.info('Google user exists. Logging in');

            return done(null, existedUser);
        } catch (error) {
            return done(error);
        }
    }

    async verifyFacebookUser(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: FacebookProfile,
        done: (error: any, user?: IUserModel) => void,
    ) {
        try {
            const existedUser = await this.userRepository.findByOriginId(profile.id);
            if (!existedUser) {
                logger.info('Facebook user does not exist. Creating new user');
                const newUser = await this.userService.createFacebookUser(profile);

                return done(null, newUser);
            }

            logger.info('Facebook user exists. Logging in');

            return done(null, existedUser);
        } catch (error) {
            return done(error);
        }
    }
}

export { AuthService };
