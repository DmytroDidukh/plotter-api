import { NextFunction, Request, Response } from 'express';
import { ApiAccessDeniedError } from '@api-modules/errors';

import { UserRepository } from 'repositories/user';
import { AuthService, PasswordService, UserService } from 'services/index';
import { IUserModel } from 'types/interfaces';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const passwordService = new PasswordService();

const authService = new AuthService(userRepository, userService, passwordService);

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
