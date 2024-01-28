import { body, ValidationChain } from 'express-validator';

import { createNotAllowedBodySchema } from 'middleware/validators/body-not-allowed';

import { USER_VALIDATION_ERROR_MESSAGES } from '../../consts/error/messages';
import { USER_FIELDS_NAMES } from '../../consts/user';

const signUpSchema: ValidationChain[] = [
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
    ...createNotAllowedBodySchema([
        USER_FIELDS_NAMES.EMAIL,
        USER_FIELDS_NAMES.USERNAME,
        USER_FIELDS_NAMES.PASSWORD,
        USER_FIELDS_NAMES.PASSWORD_CONFIRMATION,
    ]),
];

const signInSchema: ValidationChain[] = [
    body(USER_FIELDS_NAMES.EMAIL_OR_USERNAME)
        .notEmpty()
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.USERNAME_OR_EMAIL_EMPTY),
    body(USER_FIELDS_NAMES.PASSWORD)
        .notEmpty()
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.PASSWORD_EMPTY),
    ...createNotAllowedBodySchema([
        USER_FIELDS_NAMES.EMAIL_OR_USERNAME,
        USER_FIELDS_NAMES.PASSWORD,
    ]),
];

export const authValidator = {
    signUpSchema,
    signInSchema,
};
