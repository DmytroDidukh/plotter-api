import { Response } from 'express';

import config from 'config/config';

interface ICookieConfig {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
}

class CookieService {
    private config: ICookieConfig = {
        maxAge: 2592000000, // 30 days
        httpOnly: true,
        secure: false, // TODO: set "secure" to true if "https" website is available
    };

    getConfig(): ICookieConfig {
        return this.config;
    }

    setConfig(customConfig?: ICookieConfig): void {
        this.config = { ...this.config, ...customConfig };
    }

    getName(): string {
        return config.COOKIE_NAME;
    }

    getSecret(): string {
        return config.SESSION_SECRET;
    }

    setCookie(res: Response, sessionId: string): void {
        res.cookie(this.getName(), sessionId, this.getConfig());
    }
}

export default CookieService;
