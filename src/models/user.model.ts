import { model, Schema } from 'mongoose';

import { USER_ACCESS_TYPES, USER_AUTH_TYPES, USER_FIELDS_NAMES, USER_ROLES } from 'consts/user';
import { IUserModel } from 'types/interfaces/user';

const userSchema = new Schema<IUserModel>(
    {
        [USER_FIELDS_NAMES.ORIGIN_ID]: { type: String, required: false, unique: true, default: '' },
        [USER_FIELDS_NAMES.USERNAME]: { type: String, required: true, unique: false },
        [USER_FIELDS_NAMES.EMAIL]: { type: String, required: false, unique: true },
        [USER_FIELDS_NAMES.FIRST_NAME]: { type: String, required: false, default: '' },
        [USER_FIELDS_NAMES.LAST_NAME]: { type: String, required: false, default: '' },
        [USER_FIELDS_NAMES.PROFILE_PICTURE]: { type: String, required: false, default: '' },
        [USER_FIELDS_NAMES.ROLE]: { type: String, default: USER_ROLES.USER },
        [USER_FIELDS_NAMES.ACCESS_TYPE]: { type: String, default: USER_ACCESS_TYPES.ACTIVE },
        [USER_FIELDS_NAMES.AUTH_TYPE]: { type: String, default: USER_AUTH_TYPES.BASIC },
        [USER_FIELDS_NAMES.HASH]: { type: String, required: false, default: '' },
        [USER_FIELDS_NAMES.SALT]: { type: String, required: false, default: '' },
    },
    { timestamps: true },
);

const UserModel = model<IUserModel>('User', userSchema);

export { UserModel };
