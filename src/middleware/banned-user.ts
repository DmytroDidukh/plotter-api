import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ApiAccessDeniedError } from '@api-modules/errors';

import { AuthService, UserService } from 'services/index';
import { IUserModel } from 'types/interfaces';

async function bannedUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const authService = Container.get(AuthService);

    const user = req.user as IUserModel;

    const isBanned = UserService.checkBanStatus(user.accessType);
    if (isBanned) {
        await authService.signOut(req);

        throw new ApiAccessDeniedError({ message: 'Current user is banned' });
    } else {
        next();
    }
}

export { bannedUserMiddleware };
