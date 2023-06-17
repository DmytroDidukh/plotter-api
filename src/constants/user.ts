enum USER_ACCESS_TYPES {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
    BANNED = 'BANNED',
}

enum USER_FIELDS_NAMES {
    ID = 'id',
    EMAIL = 'email',
    USERNAME = 'username',
    PASSWORD = 'password',
    PASSWORD_CONFIRMATION = 'passwordConfirmation',
    BIRTH_DATE = 'birthDate',
    PROFILE_PICTURE = 'profilePicture',
    ACCESS_TYPE = 'accessType',
    EMAIL_OR_USERNAME = 'emailOrUsername',
    IS_ACTIVE = 'isActive',
    HASH = 'hash',
    SALT = 'salt',
}

export { USER_ACCESS_TYPES, USER_FIELDS_NAMES };
