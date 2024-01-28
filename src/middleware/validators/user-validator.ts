import { body, param, ValidationChain } from 'express-validator';

import { USER_VALIDATION_ERROR_MESSAGES } from 'consts/error';
import { USER_ACCESS_TYPES, USER_FIELDS_NAMES } from 'consts/user';
import { createNotAllowedBodySchema } from 'middleware/validators/body-not-allowed';
import { validateURL } from 'utils/url';

const updateAccessTypeSchema: ValidationChain[] = [
    param(USER_FIELDS_NAMES.ID)
        .isMongoId()
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.USER_ID_INVALID),
    body(USER_FIELDS_NAMES.ACCESS_TYPE)
        .notEmpty()
        .isIn(Object.values(USER_ACCESS_TYPES))
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.ACCESS_TYPE_INVALID),
    ...createNotAllowedBodySchema([USER_FIELDS_NAMES.ACCESS_TYPE]),
];

const updateDataSchema: ValidationChain[] = [
    param(USER_FIELDS_NAMES.ID)
        .isMongoId()
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.USER_ID_INVALID),
    body(USER_FIELDS_NAMES.USERNAME)
        .optional()
        .isString()
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.USERNAME_TYPE),
    body(USER_FIELDS_NAMES.BIRTH_DATE)
        .optional()
        .isISO8601()
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.BIRTH_DATE_FORMAT),
    body(USER_FIELDS_NAMES.PROFILE_PICTURE)
        .optional()
        .custom((value) => {
            return value === '' || validateURL(value);
        })
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.PROFILE_PICTURE_FORMAT),
    ...createNotAllowedBodySchema([
        USER_FIELDS_NAMES.USERNAME,
        USER_FIELDS_NAMES.BIRTH_DATE,
        USER_FIELDS_NAMES.PROFILE_PICTURE,
    ]),
];

const deleteSchema: ValidationChain[] = [
    param(USER_FIELDS_NAMES.ID)
        .isMongoId()
        .withMessage(USER_VALIDATION_ERROR_MESSAGES.USER_ID_INVALID),
    ...createNotAllowedBodySchema([]),
];

export const userValidator = {
    updateAccessTypeSchema,
    updateDataSchema,
    deleteSchema,
};
