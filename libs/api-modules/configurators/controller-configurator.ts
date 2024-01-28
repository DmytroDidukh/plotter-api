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

    static configure<T>(controllerClass: T): T {
        const configuredController = {} as T;

        Object.getOwnPropertyNames(controllerClass).forEach((methodName) => {
            const method = (controllerClass as any)[methodName];

            if (typeof method === 'function' && methodName !== 'constructor') {
                // Wrap the method with the controller action middleware
                configuredController[methodName as keyof T] = this.handleAction(method);
            }
        });

        return configuredController;
    }
}

export { ControllerConfigurator };
