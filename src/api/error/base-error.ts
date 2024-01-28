import { ERROR_CODES } from 'consts/error';
import { IBaseErrorOptions } from 'types/interfaces/error';

class ApiBaseError extends Error {
    httpStatus: number;
    message: string;
    code: number;
    type: string;
    innerError?: Error;

    constructor(options: IBaseErrorOptions) {
        const {
            httpStatus,
            message,
            code = ERROR_CODES.UNKNOWN,
            type = 'Unknown Error',
            innerError,
        } = options;

        super(message);

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);

        this.code = code;
        this.httpStatus = httpStatus;
        this.type = type;
        this.innerError = innerError;
    }
}

export { ApiBaseError };
