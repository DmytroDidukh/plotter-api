import { Request } from 'express';
import { Container, Inject, Service } from 'typedi';
import { ControllerConfigurator } from '@api-modules/configurators';

import { UserService } from 'services/index';
import { IResponseDateMessage } from 'types/interfaces';
import { IUpdateUserDto, IUserDto, IUserModel } from 'types/interfaces/user';

@Service()
class UserController {
    @Inject()
    private readonly userService: UserService;

    async myProfile(req: Request): Promise<IUserDto> {
        const user = req.user as IUserModel;

        return this.userService.mapModelToDto(user);
    }

    async updateMe(req: Request): Promise<IUserDto> {
        const currentUserId = UserService.getIdFromModel(req.user as IUserModel);
        const targetUserId = req.params.id as string;

        const data = req.body as IUpdateUserDto;

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
