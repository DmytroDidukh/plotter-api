import 'reflect-metadata'; // Should be imported before any other imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import flash from 'express-flash';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandlerMiddleware } from '@api-modules/middleware/error-handler.middleware';
import { Logger } from '@api-modules/services';

import config from 'config/config';
import { passportConfigurator, sessionConfigurator } from 'configurators/index';
import { initializeDatabase } from 'db/index';
import { rootRouter } from 'routes/index';

const logger = new Logger();

const app: Express = express();
const mongoClientPromise = initializeDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    cors({
        origin: config.CLIENT_ORIGIN,
        credentials: true,
    }),
);
app.use(flash());

// SESSION
sessionConfigurator.configure(app, mongoClientPromise);

// PASSPORT
passportConfigurator.configure(app);

// ROUTES
app.use(rootRouter);

// ERROR HANDLER
app.use(errorHandlerMiddleware);

app.listen(config.PORT, () => {
    logger.info(`SERVER IS STARTED ON ${config.PORT}`);
});
