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
import { ErrorRedirectResult, Logger, RedirectResults } from '@api-modules/services';

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
        const existedUser = await this.userRepository.findByEmail(user.email);

        if (existedUser) {
            throw new ApiConflictError({
                resourceName: 'user',
                resourceId: user.email,
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
                    return;
                }

                req.login(user, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(this.userService.mapModelToDto(user));
                });
            })(req, res, next);
        });
    }

    async googleSignIn(req: Request, res: Response, next: NextFunction): Promise<RedirectResults> {
        return this.handleExternalSignIn('google', req, res, next);
    }

    async facebookSignIn(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<RedirectResults> {
        return this.handleExternalSignIn('facebook', req, res, next);
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

    private handleExternalSignIn(
        strategy: string,
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<RedirectResults> {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                strategy,
                (err: ApiInvalidAuthenticationError, user: IUserModel) => {
                    if (err) {
                        logger.error(`${strategy} sign in error`, err);
                        reject(new ErrorRedirectResult(`${config.CLIENT_ORIGIN}/sign-in`, err));
                        return;
                    } else if (!user) {
                        logger.error(
                            `${strategy} sign in error: user not found or permissions denied`,
                        );
                        reject(
                            new ErrorRedirectResult(
                                `${config.CLIENT_ORIGIN}/sign-in`,
                                new ApiAccessDeniedError(),
                                { message: 'User not found or permissions denied' },
                            ),
                        );
                        return;
                    }

                    req.login(user, (err) => {
                        if (err) {
                            reject(new ErrorRedirectResult(`${config.CLIENT_ORIGIN}/sign-in`, err));
                            return;
                        }

                        resolve(new RedirectResults(config.CLIENT_ORIGIN));
                    });
                },
            )(req, res, next);
        });
    }

    async verifyUser(
        email: string,
        password: string,
        done: (error: any, user?: IUserModel) => void,
    ) {
        try {
            const user = await this.userRepository.findByEmail(email);

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
