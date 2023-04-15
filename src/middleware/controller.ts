import { Request, Response } from 'express';
import { HTTP_STATUSES } from 'constants/error';
import { responseService } from 'services/response';

function controllerMiddleware(routeHandler) {
    return async function controllerMiddleware(req: Request, res: Response) {
        try {
            const data = await routeHandler(req, res);

            if (data === undefined) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT);
                return;
            }

            responseService.sendResponse(res, data);
        } catch (error) {
            responseService.sendError(res, error);
        }
    };
}

function createController() {
    return controllerMiddleware;
}

export { createController };
