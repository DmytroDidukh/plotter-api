import { NextFunction, Request, Response } from 'express';
import { ValidationChain, ValidationError, validationResult } from 'express-validator';
import { ApiInvalidParamsError } from '@api-modules/errors';

import { ValidationUtils } from 'utils/validation.utils';

/**
 * Higher-order function that accepts a validation schema and returns middleware
 * @param schema
 */
function validationMiddleware(schema: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Apply the schema validations to the request
        await Promise.all(schema.map((validation) => validation.run(req)));

        const errorFormatter = (error: ValidationError) => {
            if (ValidationUtils.isFieldValidationError(error)) {
                return `${error.msg} Location: (${error.location})`;
            }

            return error.msg;
        };

        const errors = validationResult(req).formatWith(errorFormatter);
        if (errors.isEmpty()) {
            return next();
        }

        throw new ApiInvalidParamsError({ errors: errors.array() });
    };
}

export { validationMiddleware };
