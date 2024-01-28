import { NextFunction, Request, Response } from 'express';
import { ControllerConfigurator } from '@api-modules/configurators';

import { authService } from 'services/auth';
import { IResponseMessage, IUserDto } from 'types/interfaces';

class AuthController {
    async signUp(req: Request): Promise<IUserDto> {
        return authService.signUp(req);
    }

    async signIn(req: Request, res: Response, next: NextFunction): Promise<IUserDto> {
        return authService.signIn(req, res, next);
    }

    async signOut(req: Request): Promise<IResponseMessage> {
        return authService.signOut(req);
    }
}

export const authController = ControllerConfigurator.configure<AuthController>(
    new AuthController(),
);
