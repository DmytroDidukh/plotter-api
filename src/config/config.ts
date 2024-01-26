import path from 'path';

import dotenv from 'dotenv';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these variables or not setup a .env file at all

interface ENV {
    NODE_ENV: string | undefined;
    PORT: number | undefined;
    MONGO_URI: string | undefined;
    SESSION_SECRET: string | undefined;
    COOKIE_NAME: string | undefined;
    GOOGLE_AUTH_CLIENT_ID: string | undefined;
    GOOGLE_AUTH_CLIENT_SECRET: string | undefined;
    GOOGLE_APP_REDIRECT_URI: string | undefined;
    GOOGLE_AUTH_EMAIL_SCOPE: string | undefined;
    GOOGLE_AUTH_PROFILE_SCOPE: string | undefined;
}

interface Config {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
    SESSION_SECRET: string;
    COOKIE_NAME: string;
    GOOGLE_AUTH_CLIENT_ID: string;
    GOOGLE_AUTH_CLIENT_SECRET: string;
    GOOGLE_APP_REDIRECT_URI: string;
    GOOGLE_AUTH_EMAIL_SCOPE: string;
    GOOGLE_AUTH_PROFILE_SCOPE: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT ? Number(process.env.PORT) : 8080,
        MONGO_URI: process.env.MONGO_URI,
        SESSION_SECRET: process.env.SESSION_SECRET,
        COOKIE_NAME: process.env.COOKIE_NAME,
        GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
        GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        GOOGLE_APP_REDIRECT_URI: process.env.GOOGLE_APP_REDIRECT_URI,
        GOOGLE_AUTH_EMAIL_SCOPE: process.env.GOOGLE_AUTH_EMAIL_SCOPE,
        GOOGLE_AUTH_PROFILE_SCOPE: process.env.GOOGLE_AUTH_PROFILE_SCOPE,
    };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitizedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
