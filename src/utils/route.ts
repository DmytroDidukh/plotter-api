import { HTTP_METHODS } from 'constants/common';

import { RequestHandler, Router } from 'express';

function wrapAsync(fn: RequestHandler): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

function registerRoute(
    router: Router,
    method: HTTP_METHODS,
    path: string,
    ...middlewares: RequestHandler[]
): void {
    const wrappedMiddlewares = middlewares.map((middleware) => wrapAsync(middleware));

    router[method](path, ...wrappedMiddlewares);
}

export { registerRoute };
