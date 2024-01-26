import { NextFunction, Request, Response } from 'express';

import { createController } from 'middleware/controller';
import { authService } from 'services/auth';
import { IResponseMessage, IUserDto } from 'types/interfaces';

const controller = createController();

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
    signUp: controller(signUp),
    signIn: controller(signIn),
    signOut: controller(signOut),
};
