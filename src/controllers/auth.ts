import { NextFunction, Request, Response } from 'express';
import { ControllerConfigurator } from '@api-modules/configurators';

import { authService } from 'services/auth';
import { IResponseMessage, IUserDto } from 'types/interfaces';

const controller = new ControllerConfigurator();

function signUp(req: Request): Promise<IUserDto> {
    return authService.signUp(req);
}

async function signIn(req: Request, res: Response, next: NextFunction): Promise<IUserDto> {
    return authService.signIn(req, res, next);
}

async function signOut(req: Request): Promise<IResponseMessage> {
    return authService.signOut(req);
}

export const authController = {
    signUp: controller.handleAction(signUp),
    signIn: controller.handleAction(signIn),
    signOut: controller.handleAction(signOut),
};
