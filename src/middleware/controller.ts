import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUSES } from 'consts/error';
import { responseService } from 'services/response';

function controllerMiddleware(routeHandler) {
    return async function controllerMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await routeHandler(req, res, next);

            if (data === undefined) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT);
                return;
            }

            responseService.sendResponse(res, data);
        } catch (error) {
            throw error;
        }
    };
}

function createController() {
    return controllerMiddleware;
}

export { createController };
