// TODO: Split by AUTH and USER messages
const USER_VALIDATION_ERROR_MESSAGES = {
    EMAIL: 'Please provide a valid email',
    PASSWORD:
        // eslint-disable-next-line max-len
        'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character',
    PASSWORD_CONFIRMATION: 'Password confirmation does not match password',
    PASSWORD_EMPTY: 'Please provide a password',
    ACCESS_TYPE_INVALID: 'Invalid access type provided',
    USER_ID_INVALID: 'Invalid user ID',
    PROFILE_PICTURE_FORMAT: 'Profile picture must be a URL',
    FIRST_NAME: 'First name must be a string',
    LAST_NAME: 'Last name must be a string',
};

export { USER_VALIDATION_ERROR_MESSAGES };
