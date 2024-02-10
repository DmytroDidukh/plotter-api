import { Response } from 'express';
import { ApiUnhandledError } from '@api-modules/errors';

import { Logger } from './logger';

import { HTTP_STATUSES } from '../consts/api';
import { ApiBaseError } from '../errors/base-error';

const logger = new Logger();

class ResponseService {
    static sendResponse(res: Response, data: any): void {
        res.send({ data });
    }

    static redirect(res: Response, url: string): void {
        res.redirect(url);
    }

    static sendError(res: Response, error: ApiBaseError): void {
        if (this.isHeadersSet(res)) {
            logger.error('Response has been sent', error);
            return;
        }

        if (this.isKnownError(error)) {
            const errorResponse = this.prepareErrorResponse(error);

            res.status(error.httpStatus || HTTP_STATUSES.INTERNAL_SERVER_ERROR).send(errorResponse);

            logger.error('Known error occurred', error);
        } else {
            const _error = new ApiUnhandledError({ innerError: error });
            const genericErrorResponse = this.prepareErrorResponse(_error);

            res.status(_error.httpStatus).send(genericErrorResponse);

            logger.error('Unhandled error occurred', error);
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

    private static isHeadersSet(res: Response): boolean {
        return res.headersSent;
    }
}

export { ResponseService };
