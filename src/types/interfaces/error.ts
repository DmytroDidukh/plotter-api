import { ERROR_CODES, HTTP_STATUSES } from '../../consts/error';

interface IBaseErrorOptions {
    httpStatus: number;
    message: string;
    code: number;
    type: string;
    innerError?: Error;
}

interface IErrorOptions {
    code?: ERROR_CODES;
    httpStatus?: HTTP_STATUSES;
    type?: string;
    message?: string;
    innerError?: Error;
}

interface INotFoundErrorOptions extends IErrorOptions {
    resourceName: string;
    resourceId: string;
}

interface IInvalidBodyErrorOptions extends IErrorOptions {
    errors: string[];
}

export { IBaseErrorOptions, IErrorOptions, INotFoundErrorOptions, IInvalidBodyErrorOptions };
