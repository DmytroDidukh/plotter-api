import { body, ValidationChain } from 'express-validator';

import { USER_FIELDS_NAMES, USER_VALIDATION_ERROR_MESSAGES } from 'consts/index';

import { Validator } from './base-validator';

export class AuthValidator extends Validator {
    static signUpSchema: ValidationChain[] = [
        body(USER_FIELDS_NAMES.EMAIL).isEmail().withMessage(USER_VALIDATION_ERROR_MESSAGES.EMAIL),
        body(USER_FIELDS_NAMES.USERNAME)
            .notEmpty()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.USERNAME_EMPTY)
            .bail()
            .isLength({ min: 2, max: 50 })
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.USERNAME_INVALID),
        body(USER_FIELDS_NAMES.PASSWORD)
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/)
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.PASSWORD),
        body(USER_FIELDS_NAMES.PASSWORD_CONFIRMATION).custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(USER_VALIDATION_ERROR_MESSAGES.PASSWORD_CONFIRMATION);
            }
            return true;
        }),
        ...this.createNotAllowedBodySchema([
            USER_FIELDS_NAMES.EMAIL,
            USER_FIELDS_NAMES.USERNAME,
            USER_FIELDS_NAMES.PASSWORD,
            USER_FIELDS_NAMES.PASSWORD_CONFIRMATION,
        ]),
    ];

    static signInSchema: ValidationChain[] = [
        body(USER_FIELDS_NAMES.EMAIL_OR_USERNAME)
            .notEmpty()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.USERNAME_OR_EMAIL_EMPTY),
        body(USER_FIELDS_NAMES.PASSWORD)
            .notEmpty()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.PASSWORD_EMPTY),
        ...this.createNotAllowedBodySchema([
            USER_FIELDS_NAMES.EMAIL_OR_USERNAME,
            USER_FIELDS_NAMES.PASSWORD,
        ]),
    ];
}
