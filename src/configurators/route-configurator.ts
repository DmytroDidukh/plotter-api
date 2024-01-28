import express, { RequestHandler, Router } from 'express';

enum HTTP_METHODS {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete',
}

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

export { HTTP_METHODS, RouteConfigurator };
