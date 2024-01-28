import { IErrorOptions } from './api-error';
import { ApiBaseError } from './base-error';

import { ERROR_CODES, HTTP_STATUSES } from '../consts/api';

interface IConflictErrorOptions extends IErrorOptions {
    resourceName: string;
    resourceId: string;
}

class ApiConflictError extends ApiBaseError {
    constructor(options: IConflictErrorOptions) {
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
