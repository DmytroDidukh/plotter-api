import { Response } from 'express';

import config from 'config/config';

interface ICookieConfig {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
}

function getConfig(config?: ICookieConfig): ICookieConfig {
    return {
        maxAge: 2592000000, // 30 days
        httpOnly: true,
        // TODO: set "secure" to true if "https" website is available
        secure: false,
        ...(config || {}),
    };
}

function getName(): string {
    return config.COOKIE_NAME;
}

function setCookie(res: Response, sessionId: string, config?: ICookieConfig): void {
    const _name = this.getName();
    const _config = this.getConfig(config);

    res.cookie(_name, sessionId, _config);
}

export const cookieService = { setCookie, getConfig, getName };
