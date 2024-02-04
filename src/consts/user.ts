enum USER_ACCESS_TYPES {
    ACTIVE = 'ACTIVE',
    BANNED = 'BANNED',
    DELETED = 'DELETED',
    INACTIVE = 'INACTIVE',
}

enum USER_ROLES {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

enum USER_AUTH_TYPES {
    BASIC = 'BASIC',
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
}

enum USER_FIELDS_NAMES {
    ID = 'id',
    ORIGIN_ID = 'originId', // For non-basic auth
    EMAIL = 'email',
    USERNAME = 'username',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    PASSWORD = 'password',
    PASSWORD_CONFIRMATION = 'passwordConfirmation',
    PROFILE_PICTURE = 'profilePicture',
    ACCESS_TYPE = 'accessType',
    ROLE = 'role',
    AUTH_TYPE = 'authType',
    EMAIL_OR_USERNAME = 'emailOrUsername',
    HASH = 'hash',
    SALT = 'salt',
}

export { USER_ACCESS_TYPES, USER_ROLES, USER_AUTH_TYPES, USER_FIELDS_NAMES };
