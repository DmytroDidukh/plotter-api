import { Response } from 'express';
import { ApiUnhandledError } from '@api-modules/errors';

import { HTTP_STATUSES } from '../consts/api';
import { ApiBaseError } from '../errors/base-error';

class ResponseService {
    static sendResponse(res: Response, data: any): void {
        res.send({ data });
    }

    static sendError(res: Response, error: ApiBaseError): void {
        if (this.isKnownError(error)) {
            const errorResponse = this.prepareErrorResponse(error);

            res.status(error.httpStatus || HTTP_STATUSES.INTERNAL_SERVER_ERROR).send(errorResponse);
        } else {
            const _error = new ApiUnhandledError({ innerError: error });
            const genericErrorResponse = this.prepareErrorResponse(_error);

            res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).send(genericErrorResponse);
        }
    }

    private static prepareErrorResponse(error: ApiBaseError): {
        code: number;
        type: string;
        message: string;
    } {
        return {
            code: error.code,
            type: error.type,
            message: error.message,
        };
    }

    private static isKnownError(error: ApiBaseError): boolean {
        return !!(error.httpStatus && error.code && error.type && error.message);
    }
}

export { ResponseService };
