import mongoose from 'mongoose';
import { Logger } from '@api-modules/services';

import config from 'config/config';

const logger = new Logger();

async function initializeDatabase(): Promise<mongoose.mongo.MongoClient> {
    try {
        const m = await mongoose.connect(config.MONGO_URI);
        logger.info('DB CONNECTED');

        return m.connection.getClient();
    } catch (error) {
        logger.error('DB CONNECTION ERROR: ', error);
    }
}

export { initializeDatabase };
