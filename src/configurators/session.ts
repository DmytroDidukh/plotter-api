import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

import config from 'config/config';
import { cookieService } from 'services/cookie';

class SessionConfigurator {
    public configure(
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

        console.log('SESSIONS SET');
    }
}

const sessionConfigurator = new SessionConfigurator();

export default sessionConfigurator;
