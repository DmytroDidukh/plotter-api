import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Container, Service } from 'typedi';
import { ApiAccessDeniedError, ApiSignInCredentialsError } from '@api-modules/errors';
import { Logger } from '@api-modules/services';

import config from 'config/config';
import { USER_FIELDS_NAMES } from 'consts/user';
import { UserRepository } from 'repositories/user.repository';
import { PasswordService, UserService } from 'services/index';
import { IUserModel } from 'types/interfaces';

const logger = new Logger();

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

        logger.info('PASSPORT CONFIGURED');
    }

    private configureLocalStrategy(): void {
        passport.use(
            new LocalStrategy(
                { usernameField: USER_FIELDS_NAMES.EMAIL_OR_USERNAME },
                this.verifyUser.bind(this),
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
                    passReqToCallback: true,
                    scope: [config.GOOGLE_AUTH_EMAIL_SCOPE, config.GOOGLE_AUTH_PROFILE_SCOPE],
                },
                this.verifyGoogleUser.bind(this),
            ),
        );
    }

    // Retrieves the user data from the session
    private async deserializeUser(id: string, done: (error: any, user?: any) => void) {
        console.log('deserializeUser', id);
        try {
            const user = await this.userRepository.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    }

    // Determines what user information should be stored in the session
    private serializeUser(user: IUserModel, done: (error: any, id?: any) => void) {
        console.log('serializeUser', user);
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
            console.log('verifyUser', emailOrUsername, password);
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

    private async verifyGoogleUser(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: IUserModel) => void,
    ) {
        logger.info('GOOGLE USER: ', profile);
        try {
            const existedUser = await this.userRepository.findByEmail(profile.emails[0].value);

            if (!existedUser) {
                const newUser = await this.userService.createGoogleUser(profile);

                return done(null, newUser);
            }

            return done(null, existedUser);
        } catch (error) {
            return done(error);
        }
    }
}

const passportConfigurator = Container.get(PassportConfigurator);

export default passportConfigurator;
