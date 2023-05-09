import { ApiBaseError } from './base-error';
import { HTTP_STATUSES, ERROR_CODES } from 'constants/error';
import { convertErrorsArrayToMessage } from 'utils/convert-errors-array-to-messages';
import { IInvalidBodyErrorOptions } from 'types/interfaces/error';

class ApiInvalidParamsError extends ApiBaseError {
    constructor(options: IInvalidBodyErrorOptions) {
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

        const message = convertErrorsArrayToMessage(initialMessage, errors);

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
