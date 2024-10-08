import { Request } from 'express';
import { Container, Service } from 'typedi';
import { ControllerConfigurator } from '@api-modules/configurators';

import { IResponseDateMessage, UserService } from 'services/index';
import { IUpdateUserInput, IUserDto, IUserModel } from 'types/interfaces/user';

@Service()
class UserController {
    constructor(private readonly userService: UserService) {}

    async myProfile(req: Request): Promise<IUserDto> {
        const user = req.user as IUserModel;
        return this.userService.mapModelToDto(user);
    }

    async updateMe(req: Request): Promise<IUserDto> {
        const currentUserId = UserService.getIdFromModel(req.user as IUserModel);
        const targetUserId = req.params.id as string;

        const data = req.body as IUpdateUserInput;

        return this.userService.updateMe(currentUserId, targetUserId, data);
    }

    async deleteMe(req: Request): Promise<IResponseDateMessage> {
        const currentUserId = UserService.getIdFromModel(req.user as IUserModel);
        const targetUserId = req.params.id as string;

        return this.userService.deleteMe(currentUserId, targetUserId);
    }

    async updateAccessType(req: Request): Promise<IUserDto> {
        const userId = req.params.id as string;
        const { accessType } = req.body;

        return this.userService.updateAccessType(userId, accessType);
    }
}

export const userController = ControllerConfigurator.configure<UserController>(
    Container.get(UserController),
);
