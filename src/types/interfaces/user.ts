import { Types } from 'mongoose';

import { USER_ACCESS_TYPES } from '../../consts/user';

interface IUserShared {
    username: string;
    email: string;
}

interface IUserBase extends IUserShared {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    profilePicture?: string;
    accessType?: USER_ACCESS_TYPES;
}

interface IUserModel extends IUserBase {
    _id: Types.ObjectId;
    salt: string;
    hash: string;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserDto extends IUserBase {
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface ISignUpUserDto extends IUserShared {
    password: string;
    passwordConfirmation: string;
}

// TODO: add "email" and "username"
interface IUpdateUserDto
    extends Pick<IUserDto, 'firstName' | 'lastName' | 'birthDate' | 'profilePicture'> {}

export { IUserModel, IUserDto, ISignUpUserDto, IUpdateUserDto };
