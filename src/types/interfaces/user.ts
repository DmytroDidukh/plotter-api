import { Types } from 'mongoose';

import { USER_ACCESS_TYPES, USER_ROLES } from 'consts/user';

interface IUserShared {
    username: string;
    email: string;
}

interface IUserBase extends IUserShared {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    accessType?: USER_ACCESS_TYPES;
    role?: USER_ROLES;
}

interface IUserModel extends IUserBase {
    _id: Types.ObjectId;
    salt: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserDto extends IUserBase {
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface ISignUpUserInput extends IUserShared {
    password: string;
    passwordConfirmation: string;
}

// TODO: add "email" and "username"
interface IUpdateUserInput extends Pick<IUserDto, 'firstName' | 'lastName' | 'profilePicture'> {}

export { IUserModel, IUserDto, ISignUpUserInput, IUpdateUserInput };
