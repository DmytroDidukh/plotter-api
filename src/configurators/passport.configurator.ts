import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Container, Service } from 'typedi';
import { Logger } from '@api-modules/services';

import config from 'config/config';
import { USER_FIELDS_NAMES } from 'consts/user';
import { UserRepository } from 'repositories/user.repository';
import { AuthService, PasswordService } from 'services/index';
import { IUserModel } from 'types/interfaces';

const logger = new Logger();

@Service()
class PassportConfigurator {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
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
                this.authService.verifyUser,
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
                this.authService.verifyGoogleUser,
            ),
        );
    }

    // Retrieves the user data from the session
    private async deserializeUser(id: string, done: (error: any, user?: any) => void) {
        try {
            const user = await this.userRepository.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    }

    // Determines what user information should be stored in the session
    private serializeUser(user: IUserModel, done: (error: any, id?: any) => void) {
        if (user) {
            done(null, user._id);
        }
    }
}

const passportConfigurator = Container.get(PassportConfigurator);

export default passportConfigurator;
