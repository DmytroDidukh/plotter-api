import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from '../consts/api';
import { ResponseService } from '../services/response';

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

class ControllerConfigurator {
    handleAction(routeHandler: RouteHandler) {
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
            }
        };
    }
}

export { ControllerConfigurator };
