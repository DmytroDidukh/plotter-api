import { Response } from 'express';

import { HTTP_STATUSES } from '../consts/api';
import { ApiBaseError } from '../errors/base-error';

export class ResponseService {
    static sendResponse(res: Response, data: any): void {
        res.send({ data });
    }

    static sendError(res: Response, error: ApiBaseError): void {
        res.status(error.httpStatus || HTTP_STATUSES.UNIMPLEMENTED);
        res.send({
            code: error.code,
            type: error.type,
            message: error.message,
        });
    }
}
