import { IErrorOptions } from './api-error';
import { ApiBaseError } from './base-error';

import { ERROR_CODES, HTTP_STATUSES } from '../consts/api';

class ApiAccessDeniedError extends ApiBaseError {
    constructor(options: IErrorOptions = {}) {
        const {
            httpStatus = HTTP_STATUSES.FORBIDDEN,
            code = ERROR_CODES.ACCESS_DENIED,
            type = 'Access Denied',
            message = 'The authentication token in use is restricted and cannot access the requested resource.',
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

export { ApiAccessDeniedError };
