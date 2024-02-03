import { FieldValidationError, ValidationError } from 'express-validator';

class ValidationUtils {
    static isFieldValidationError(error: ValidationError): error is FieldValidationError {
        return (error as FieldValidationError).location !== undefined;
    }
}

export { ValidationUtils };
