import MongoStore from 'connect-mongo';
import express from 'express';
import flash from 'express-flash';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { ApiAccessDeniedError, ApiSignInCredentialsError } from '@api-modules/errors';

import config from 'config/config';
import { USER_FIELDS_NAMES } from 'consts/user';
import { UserRepository } from 'repositories/user';
import { cookieService } from 'services/cookie';
import { passwordService } from 'services/password';
import { userService } from 'services/user';
import { IUserModel } from 'types/interfaces';

class PassportConfigurator {
    constructor(private readonly userRepository: UserRepository) {}

    public setup(
        app: express.Application,
        mongoClientPromise: Promise<mongoose.mongo.MongoClient>,
    ): void {
        app.use(flash());
        this.setupSession(app, mongoClientPromise);

        app.use(passport.initialize());
        app.use(passport.session());

        this.configureLocalStrategy();
        this.configureGoogleStrategy();

        passport.serializeUser(this.serializeUser);
        passport.deserializeUser(this.deserializeUser);

        console.log('PASSPORT AND SESSIONS SET');
    }

    private configureLocalStrategy(): void {
        passport.use(
            new LocalStrategy(
                { usernameField: USER_FIELDS_NAMES.EMAIL_OR_USERNAME },
                (emailOrUsername, password, done) =>
                    this.verifyUser(emailOrUsername, password, done),
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

    private setupSession(
        app: express.Application,
        mongoClientPromise: Promise<mongoose.mongo.MongoClient>,
    ): void {
        app.use(
            session({
                secret: config.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                name: cookieService.getName(),
                cookie: cookieService.getConfig(),
                store: MongoStore.create({
                    clientPromise: mongoClientPromise,
                    dbName: 'plotter',
                    collectionName: 'sessions',
                    stringify: false,
                    autoRemove: 'interval',
                    autoRemoveInterval: 1,
                }),
            }),
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

            const isValidPassword = await passwordService.compare(password, user.hash);
            if (!isValidPassword) {
                return done(new ApiSignInCredentialsError());
            }

            // TODO: Add is inactive user (deleted)
            const isBanned = userService.checkBanStatus(user.accessType);
            if (isBanned) {
                return done(new ApiAccessDeniedError({ message: 'Current user is banned' }));
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
}

const userRepository = new UserRepository();
const passportConfigurator = new PassportConfigurator(userRepository);

export { passportConfigurator };
