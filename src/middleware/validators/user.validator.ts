import { body, param, ValidationChain } from 'express-validator';

import { USER_ACCESS_TYPES, USER_FIELDS_NAMES, USER_VALIDATION_ERROR_MESSAGES } from 'consts/index';
import { URLUtils } from 'utils/url.utils';

import { BasicValidator } from './basic.validator';

class UserValidator extends BasicValidator {
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
        body(USER_FIELDS_NAMES.PROFILE_PICTURE)
            .optional()
            .custom((value) => {
                return value === '' || URLUtils.validateURL(value);
            })
            .withMessage(USER_VALIDATION_ERROR_MESSAGES.PROFILE_PICTURE_FORMAT),
        ...this.createNotAllowedBodySchema([
            USER_FIELDS_NAMES.FIRST_NAME,
            USER_FIELDS_NAMES.LAST_NAME,
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

export { UserValidator };
