import { IErrorOptions } from './api-error';
import { ApiBaseError } from './base-error';

import { ERROR_CODES, HTTP_STATUSES } from '../consts/api';
import { ErrorFormatter } from '../utils/error-formatter';

interface IInvalidParamsErrorOptions extends IErrorOptions {
    errors: string[];
}

class ApiInvalidParamsError extends ApiBaseError {
    constructor(options: IInvalidParamsErrorOptions) {
        const {
            httpStatus = HTTP_STATUSES.BAD_REQUEST,
            code = ERROR_CODES.INVALID_PARAMS,
            type = 'Invalid Request Parameters',
            message:
                // eslint-disable-next-line max-len
                initialMessage = 'The entries provided as parameters were not valid for the request. Fix parameters and try again: ',
            errors,
            innerError,
        } = options;

        const message = ErrorFormatter.formatErrorsToMessage(initialMessage, errors);

        super({
            httpStatus,
            code,
            type,
            message,
            innerError,
        });
    }
}

export { ApiInvalidParamsError };
