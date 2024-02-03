import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import { Container, Service } from 'typedi';

import { CookieService } from 'services/index';

@Service()
class SessionConfigurator {
    constructor(private readonly cookieService: CookieService) {}

    public configure(
        app: express.Application,
        mongoClientPromise: Promise<mongoose.mongo.MongoClient>,
    ): void {
        const config = this.cookieService.getConfig();
        const name = this.cookieService.getName();
        const secret = this.cookieService.getSecret();

        app.use(
            session({
                secret,
                resave: false,
                saveUninitialized: false,
                name,
                cookie: config,
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

        console.log('SESSION SET');
    }
}

const sessionConfigurator = Container.get(SessionConfigurator);

export default sessionConfigurator;
