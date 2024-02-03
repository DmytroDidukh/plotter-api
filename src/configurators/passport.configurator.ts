import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Container, Service } from 'typedi';
import { ApiAccessDeniedError, ApiSignInCredentialsError } from '@api-modules/errors';

import config from 'config/config';
import { USER_FIELDS_NAMES } from 'consts/user';
import { UserRepository } from 'repositories/user.repository';
import { PasswordService, UserService } from 'services/index';
import { IUserModel } from 'types/interfaces';

@Service()
class PassportConfigurator {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,
        private readonly passwordService: PasswordService,
    ) {}

    public configure(app: express.Application): void {
        app.use(passport.initialize());
        app.use(passport.session());

        this.configureLocalStrategy();
        this.configureGoogleStrategy();

        passport.serializeUser(this.serializeUser.bind(this));
        passport.deserializeUser(this.deserializeUser.bind(this));

        console.log('PASSPORT SET');
    }

    private configureLocalStrategy(): void {
        passport.use(
            new LocalStrategy(
                { usernameField: USER_FIELDS_NAMES.EMAIL_OR_USERNAME },
                (emailOrUsername, password, done) =>
                    this.verifyUser.call(this, emailOrUsername, password, done),
            ),
        );
    }

    private configureGoogleStrategy(): void {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: config.GOOGLE_AUTH_CLIENT_ID,
                    clientSecret: config.GOOGLE_AUTH_CLIENT_SECRET,
                    callbackURL: config.GOOGLE_APP_REDIRECT_URI,
                },
                async (accessToken, refreshToken, profile, done) => {
                    console.log('GOOGLE USER: ', profile);

                    return done(null, profile);
                },
            ),
        );
    }

    private async deserializeUser(id: string, done: (error: any, user?: any) => void) {
        try {
            const user = await this.userRepository.getById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    }

    private serializeUser(user: IUserModel, done: (error: any, id?: any) => void) {
        if (user) {
            done(null, user._id);
        }
    }

    private async verifyUser(
        emailOrUsername: string,
        password: string,
        done: (error: any, user?: IUserModel) => void,
    ) {
        try {
            const user = await this.userRepository.getByUsernameOrEmail({
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
}

const passportConfigurator = Container.get(PassportConfigurator);

export default passportConfigurator;
