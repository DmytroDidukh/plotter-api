import { ERROR_CODES, HTTP_STATUSES } from 'consts/error';
import { IErrorOptions } from 'types/interfaces/error';

import { ApiBaseError } from './base-error';

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

export { ApiError };
