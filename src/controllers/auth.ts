import { NextFunction, Request, Response } from 'express';
import { ControllerConfigurator } from '@api-modules/configurators';

import { UserRepository } from 'repositories/user';
import { AuthService, PasswordService, UserService } from 'services/index';
import { IResponseMessage, IUserDto } from 'types/interfaces';

class AuthController {
    constructor(private readonly authService: AuthService) {}

    async signUp(req: Request): Promise<IUserDto> {
        return this.authService.signUp(req);
    }

    async signIn(req: Request, res: Response, next: NextFunction): Promise<IUserDto> {
        return this.authService.signIn(req, res, next);
    }

    async signOut(req: Request): Promise<IResponseMessage> {
        return this.authService.signOut(req);
    }
}

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const passwordService = new PasswordService();

const authService = new AuthService(userRepository, userService, passwordService);

export const authController = ControllerConfigurator.configure<AuthController>(
    new AuthController(authService),
);
