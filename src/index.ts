import 'reflect-metadata'; // Should be imported before any other imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import flash from 'express-flash';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandlerMiddleware } from '@api-modules/middleware/error-handler';

import config from 'config/config';
import { passportConfigurator, sessionConfigurator } from 'configurators/index';
import { setupDatabase } from 'db/index';
import { rootRouter } from 'routes/index';

const app: Express = express();
const mongoClientPromise = setupDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
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
    console.log(`SERVER IS STARTED ON ${config.PORT}`);
});
