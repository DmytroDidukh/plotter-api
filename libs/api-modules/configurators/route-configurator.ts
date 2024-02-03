import express, { RequestHandler, Router } from 'express';

import { HTTP_METHODS } from '../consts/api';

class RouteConfigurator {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    private wrapAsync(fn: RequestHandler): RequestHandler {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    }

    public registerRoute(
        method: HTTP_METHODS,
        path: string,
        ...middlewares: RequestHandler[]
    ): void {
        const wrappedMiddlewares = middlewares.map((middleware) => this.wrapAsync(middleware));
        this.router[method](path, ...wrappedMiddlewares);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default RouteConfigurator;
