import { body, param, ValidationChain } from 'express-validator';

import { USER_ACCESS_TYPES, USER_FIELDS_NAMES, USER_VALIDATION_ERROR_MESSAGES } from 'consts/index';
import { URLUtils } from 'utils/url';

import { Validator } from './base-validator';

export class UserValidator extends Validator {
    static updateAccessTypeSchema: ValidationChain[] = [
        param(USER_FIELDS_NAMES.ID)
            .isMongoId()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.USER_ID_INVALID),
        body(USER_FIELDS_NAMES.ACCESS_TYPE)
            .notEmpty()
            .isIn(Object.values(USER_ACCESS_TYPES))
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.ACCESS_TYPE_INVALID),
        ...this.createNotAllowedBodySchema([USER_FIELDS_NAMES.ACCESS_TYPE]),
    ];

    static updateSchema: ValidationChain[] = [
        param(USER_FIELDS_NAMES.ID)
            .isMongoId()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.USER_ID_INVALID),
        body(USER_FIELDS_NAMES.USERNAME)
            .optional()
            .isString()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.USERNAME_TYPE),
        body(USER_FIELDS_NAMES.FIRST_NAME)
            .optional()
            .notEmpty()
            .isString()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.FIRST_NAME),
        body(USER_FIELDS_NAMES.LAST_NAME)
            .optional()
            .notEmpty()
            .isString()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.LAST_NAME),
        body(USER_FIELDS_NAMES.BIRTH_DATE)
            .optional()
            .isISO8601()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.BIRTH_DATE_FORMAT),
        body(USER_FIELDS_NAMES.PROFILE_PICTURE)
            .optional()
            .custom((value) => {
                return value === '' || URLUtils.validateURL(value);
            })
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.PROFILE_PICTURE_FORMAT),
        ...this.createNotAllowedBodySchema([
            USER_FIELDS_NAMES.USERNAME,
            USER_FIELDS_NAMES.FIRST_NAME,
            USER_FIELDS_NAMES.LAST_NAME,
            USER_FIELDS_NAMES.BIRTH_DATE,
            USER_FIELDS_NAMES.PROFILE_PICTURE,
        ]),
    ];

    static deleteSchema: ValidationChain[] = [
        param(USER_FIELDS_NAMES.ID)
            .isMongoId()
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.USER_ID_INVALID),
        ...this.createNotAllowedBodySchema([]),
    ];
}
