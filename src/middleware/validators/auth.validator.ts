import { body, ValidationChain } from 'express-validator';

import { USER_FIELDS_NAMES, USER_VALIDATION_ERROR_MESSAGES } from 'consts/index';

import { BasicValidator } from './basic.validator';

class AuthValidator extends BasicValidator {
    static signUpSchema: ValidationChain[] = [
        body(USER_FIELDS_NAMES.EMAIL).isEmail().withMessage(USER_VALIDATION_ERROR_MESSAGES.EMAIL),
        body(USER_FIELDS_NAMES.PASSWORD)
            .notEmpty()
            // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/)
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.PASSWORD),
        body(USER_FIELDS_NAMES.PASSWORD_CONFIRMATION).custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(USER_VALIDATION_ERROR_MESSAGES.PASSWORD_CONFIRMATION);
            }
            return true;
        }),
        ...this.createNotAllowedBodySchema([
            USER_FIELDS_NAMES.EMAIL,
            USER_FIELDS_NAMES.PASSWORD,
            USER_FIELDS_NAMES.PASSWORD_CONFIRMATION,
        ]),
    ];

    static signInSchema: ValidationChain[] = [
        body(USER_FIELDS_NAMES.EMAIL)
            .notEmpty()
            .isEmail()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.EMAIL),
        body(USER_FIELDS_NAMES.PASSWORD)
            .notEmpty()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.PASSWORD_EMPTY),
        ...this.createNotAllowedBodySchema([USER_FIELDS_NAMES.EMAIL, USER_FIELDS_NAMES.PASSWORD]),
    ];
}

export { AuthValidator };
