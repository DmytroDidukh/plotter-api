import { model, Schema } from 'mongoose';

import { USER_ACCESS_TYPES, USER_FIELDS_NAMES, USER_ROLES } from 'consts/user';
import { IUserModel } from 'types/interfaces/user';

const userSchema = new Schema<IUserModel>(
    {
        [USER_FIELDS_NAMES.USERNAME]: { type: String, required: true, unique: true },
        [USER_FIELDS_NAMES.EMAIL]: { type: String, required: true, unique: true },
        [USER_FIELDS_NAMES.FIRST_NAME]: { type: String, required: false },
        [USER_FIELDS_NAMES.LAST_NAME]: { type: String, required: false },
        [USER_FIELDS_NAMES.BIRTH_DATE]: { type: String, default: '' },
        [USER_FIELDS_NAMES.PROFILE_PICTURE]: { type: String, default: '' },
        [USER_FIELDS_NAMES.ACCESS_TYPE]: { type: String, default: USER_ACCESS_TYPES.ACTIVE },
        [USER_FIELDS_NAMES.ROLE]: { type: String, default: USER_ROLES.USER },
        [USER_FIELDS_NAMES.HASH]: { type: String, required: true },
        [USER_FIELDS_NAMES.SALT]: { type: String, required: true },
    },
    { timestamps: true },
);

const UserModel = model<IUserModel>('User', userSchema);

export { UserModel };
