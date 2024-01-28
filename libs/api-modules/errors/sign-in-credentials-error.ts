import { IErrorOptions } from './api-error';
import { ApiBaseError } from './base-error';

import { ERROR_CODES, HTTP_STATUSES } from '../consts/api';

class ApiSignInCredentialsError extends ApiBaseError {
    constructor(options: IErrorOptions = {}) {
        const {
            httpStatus = HTTP_STATUSES.UNAUTHORIZED,
            code = ERROR_CODES.WRONG_CREDENTIALS_ERROR,
            type = 'Wrong Credentials',
            message = 'Sign-in wrong credentials',
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

export { ApiSignInCredentialsError };
