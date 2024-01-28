import { ERROR_CODES, HTTP_STATUSES } from 'consts/error';
import { INotFoundErrorOptions } from 'types/interfaces/error';

import { ApiBaseError } from './base-error';

class ApiConflictError extends ApiBaseError {
    constructor(options: INotFoundErrorOptions) {
        const {
            httpStatus = HTTP_STATUSES.CONFLICT,
            code = ERROR_CODES.CONFLICT,
            type = 'Conflict',
            resourceName,
            resourceId,
            innerError,
        } = options;

        super({
            httpStatus,
            code,
            type,
            message: `The ${resourceName} with parameter '${resourceId}' already exist.`,
            innerError,
        });
    }
}

export { ApiConflictError };
