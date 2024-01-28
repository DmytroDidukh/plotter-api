import { ApiBaseError } from './base-error';

import { ERROR_CODES, HTTP_STATUSES } from '../consts/api';

interface IErrorOptions {
    code?: ERROR_CODES;
    httpStatus?: HTTP_STATUSES;
    type?: string;
    message?: string;
    innerError?: Error;
}

class ApiError extends ApiBaseError {
    constructor(options: IErrorOptions = {}) {
        const {
            httpStatus = HTTP_STATUSES.INTERNAL_SERVER_ERROR,
            code = ERROR_CODES.UNKNOWN,
            type = 'Unknown Error',
            message = 'Unknown Error',
            innerError,
        } = options;

        super({
            httpStatus,
            code,
            type,
            message,
            innerError,
        });
    }
}

export { ApiError, IErrorOptions };
