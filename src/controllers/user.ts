import { Request } from 'express';
import { ControllerConfigurator } from '@api-modules/configurators';

import { userService } from 'services/user';
import { IResponseDateMessage } from 'types/interfaces';
import { IUpdateUserDto, IUserDto, IUserModel } from 'types/interfaces/user';

const controller = new ControllerConfigurator();

async function myProfile(req: Request): Promise<IUserDto> {
    const user = req.user as IUserModel;

    return userService.mapModelToDto(user);
}

function updateMe(req: Request): Promise<IUserDto> {
    const currentUserId = userService.getIdFromModel(req.user as IUserModel);
    const targetUserId = req.params.id as string;
    const data = req.body as IUpdateUserDto;

    return userService.updateMe(currentUserId, targetUserId, data);
}

function deleteMe(req: Request): Promise<IResponseDateMessage> {
    const currentUserId = userService.getIdFromModel(req.user as IUserModel);
    const targetUserId = req.params.id as string;

    return userService.deleteMe(currentUserId, targetUserId);
}

function updateAccessType(req: Request): Promise<IUserDto> {
    const userId = req.params.id as string;
    const { accessType } = req.body;

    return userService.updateAccessType(userId, accessType);
}

export const userController = {
    me: controller.handleAction(myProfile),
    updateMe: controller.handleAction(updateMe),
    deleteMe: controller.handleAction(deleteMe),
    updateAccessType: controller.handleAction(updateAccessType),
};
