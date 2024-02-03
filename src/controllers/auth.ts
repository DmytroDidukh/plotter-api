import { NextFunction, Request, Response } from 'express';
import { Container, Service } from 'typedi';
import { ControllerConfigurator } from '@api-modules/configurators';

import { AuthService } from 'services/index';
import { IResponseMessage, IUserDto } from 'types/interfaces';

@Service()
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

export const authController = ControllerConfigurator.configure<AuthController>(
    Container.get(AuthController),
);
