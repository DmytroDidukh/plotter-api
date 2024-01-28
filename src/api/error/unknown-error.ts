import { ERROR_CODES, HTTP_STATUSES } from 'consts/error';
import { IErrorOptions } from 'types/interfaces/error';

import { ApiBaseError } from './base-error';

class ApiUnknownError extends ApiBaseError {
    constructor(options: IErrorOptions = {}) {
        const {
            httpStatus = HTTP_STATUSES.INTERNAL_SERVER_ERROR,
            code = ERROR_CODES.UNKNOWN,
            type = 'Unknown',
            message = 'Temporary issue due to an unknown internal error. Wait and retry the operation',
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

export { ApiUnknownError };
