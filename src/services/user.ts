import { ApiAccessDeniedError, ApiNotFoundError } from '@api-modules/errors';

import { USER_ACCESS_TYPES, USER_FIELDS_NAMES } from 'consts/user';
import { userRepository } from 'repositories/user';
import { IResponseDateMessage } from 'types/interfaces';
import { IUpdateUserDto, IUserDto, IUserModel } from 'types/interfaces/user';

function mapModelToDto(user: IUserModel): IUserDto {
    return {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        profilePicture: user.profilePicture,
        accessType: user.accessType,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}

async function updateMe(
    currentUserId: string,
    targetUserId: string,
    data: IUpdateUserDto,
): Promise<IUserDto> {
    const user = await userRepository.getById(targetUserId);

    if (!user) {
        throw new ApiNotFoundError({ resourceId: targetUserId, resourceName: 'user' });
    }

    const userId = this.getIdFromModel(user);
    if (currentUserId !== userId) {
        throw new ApiAccessDeniedError({ message: 'User can update only own data' });
    }

    const updatedUser = await userRepository.update(targetUserId, data);

    return this.mapModelToDto(updatedUser);
}

async function deleteMe(
    currentUserId: string,
    targetUserId: string,
): Promise<IResponseDateMessage> {
    const user = await userRepository.getById(targetUserId);

    if (!user) {
        throw new ApiNotFoundError({ resourceId: targetUserId, resourceName: 'user' });
    }

    const userId = this.getIdFromModel(user);
    if (currentUserId !== userId) {
        throw new ApiAccessDeniedError({ message: 'User can delete only own data' });
    }

    await userRepository.updateOneField(targetUserId, USER_FIELDS_NAMES.IS_ACTIVE, false);
    // TODO: MOVE IT OUT
    const currentDate = new Date(); // current date
    currentDate.setDate(currentDate.getDate() + 30); // add 30 days to current date
    const irrevocablyDeletedAt = currentDate.toISOString();
    // TODO: Add checker script that runs around and check inactive users that should be deleted

    return { message: "You've successfully deleted your account", irrevocablyDeletedAt };
}

async function updateAccessType(id: string, accessType: USER_ACCESS_TYPES): Promise<IUserDto> {
    const user = await userRepository.getById(id);

    if (!user) {
        throw new ApiNotFoundError({ resourceId: id, resourceName: 'user' });
    }

    const updatedUser = await userRepository.updateOneField(
        id,
        USER_FIELDS_NAMES.ACCESS_TYPE,
        accessType,
    );

    return this.mapModelToDto(updatedUser);
}

function checkBannedAccessType(accessType: USER_ACCESS_TYPES): boolean {
    return accessType === USER_ACCESS_TYPES.BANNED;
}

function getIdFromModel(user: IUserModel): string {
    if (!user) {
        throw TypeError('You must pass a user');
    }

    return user._id.toString();
}

export const userService = {
    mapModelToDto,
    updateMe,
    deleteMe,
    updateAccessType,
    checkBanStatus: checkBannedAccessType,
    getIdFromModel,
};
