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

enum USER_FIELDS_NAMES {
    ID = 'id',
    EMAIL = 'email',
    USERNAME = 'username',
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    PASSWORD = 'password',
    PASSWORD_CONFIRMATION = 'passwordConfirmation',
    BIRTH_DATE = 'birthDate',
    PROFILE_PICTURE = 'profilePicture',
    ACCESS_TYPE = 'accessType',
    ROLE = 'role',
    EMAIL_OR_USERNAME = 'emailOrUsername',
    HASH = 'hash',
    SALT = 'salt',
}

export { USER_ACCESS_TYPES, USER_ROLES, USER_FIELDS_NAMES };
