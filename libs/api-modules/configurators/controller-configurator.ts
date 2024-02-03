import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../consts/api';
import { ResponseService } from '../services/response';

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

class ControllerConfigurator {
    private static handleAction<T extends RouteHandler>(routeHandler: T): T {
        return async function middleware(req: Request, res: Response, next: NextFunction) {
            try {
                const data = await routeHandler(req, res, next);

                if (data === undefined) {
                    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
                    return;
                }

                ResponseService.sendResponse(res, data);
            } catch (error) {
                throw error;
                // TODO: Consider handle errors
                // next(error);
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
