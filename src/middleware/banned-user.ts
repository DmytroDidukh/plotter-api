import { NextFunction, Request, Response } from 'express';
import { ApiAccessDeniedError } from '@api-modules/errors';

import { authService, UserService } from 'services/index';
import { IUserModel } from 'types/interfaces';

async function bannedUserMiddleware(req: Request, res: Response, next: NextFunction) {
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
