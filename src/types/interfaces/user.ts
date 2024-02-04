import { Types } from 'mongoose';

import { USER_ACCESS_TYPES, USER_AUTH_TYPES, USER_ROLES } from 'consts/user';

interface IUserModel {
    _id: Types.ObjectId;
    originId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    role: USER_ROLES;
    accessType: USER_ACCESS_TYPES;
    authType: USER_AUTH_TYPES;
    salt: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserDto {
    id: string;
    originId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    role: USER_ROLES;
    accessType: USER_ACCESS_TYPES;
    authType: USER_AUTH_TYPES;
    createdAt: string;
    updatedAt: string;
}

interface ICreateUserInput {
    username: string;
    email: string;
    hash: string;
    salt: string;
}

interface ICreateGoogleUserInput {
    originId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture: string;
    authType: USER_AUTH_TYPES;
}

interface ICreateFacebookUserInput {
    originId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture: string;
    authType: USER_AUTH_TYPES;
}

interface ISignUpUserInput {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

// TODO: add "email" and "username"
interface IUpdateUserInput extends Pick<IUserDto, 'firstName' | 'lastName' | 'profilePicture'> {}

export {
    IUserModel,
    IUserDto,
    ISignUpUserInput,
    IUpdateUserInput,
    ICreateUserInput,
    ICreateGoogleUserInput,
    ICreateFacebookUserInput,
};
