import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../consts/api';
import { ErrorRedirectResult, RedirectResults } from '../services/redirect-results';
import { ResponseService } from '../services/response.service';

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

class ControllerConfigurator {
    private static handleAction<T extends RouteHandler>(routeHandler: T): T {
        return async function middleware(req: Request, res: Response, next: NextFunction) {
            try {
                const result = await routeHandler(req, res, next);

                if (res.headersSent) {
                    return;
                }

                if (result === undefined) {
                    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
                    return;
                }

                if (result instanceof RedirectResults) {
                    ResponseService.redirect(res, result.toUrl());
                    return;
                }

                ResponseService.sendResponse(res, result);
            } catch (error) {
                if (error instanceof ErrorRedirectResult) {
                    ResponseService.redirect(res, error.toUrl());
                }

                next(error.innerError || error);
            }
        } as unknown as T;
    }

    static configure<T>(controllerClassInstance: T): T {
        const prototype = Object.getPrototypeOf(controllerClassInstance);
        const configuredController = {} as T;

        Object.getOwnPropertyNames(prototype).forEach((methodName) => {
            if (methodName !== 'constructor') {
                const method = prototype[methodName];

                if (typeof method === 'function') {
                    // Wrap the method with the controller action middleware
                    configuredController[methodName as keyof T] = this.handleAction(
                        method.bind(controllerClassInstance),
                    );
                }
            }
        });

        return configuredController;
    }
}

export { ControllerConfigurator };
