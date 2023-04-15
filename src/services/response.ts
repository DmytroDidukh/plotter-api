import { Response } from 'express';
import { HTTP_STATUSES } from 'constants/error';
import { ApiBaseError } from 'api/error/base-error';

function sendResponse(res: Response, data: any): void {
    res.send({ data });
}

function sendError(res: Response, error: ApiBaseError): void {
    res.status(error.httpStatus || HTTP_STATUSES.UNIMPLEMENTED);
    res.send({
        code: error.code,
        type: error.type,
        message: error.message,
    });
}

export const responseService = { sendResponse, sendError };
