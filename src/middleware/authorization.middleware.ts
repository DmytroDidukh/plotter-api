import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ApiAccessDeniedError } from '@api-modules/errors';

import { AuthService, UserService } from 'services/index';
import { IUserModel } from 'types/interfaces';

async function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
    const authService = Container.get(AuthService);
    const userService = Container.get(UserService);

    const user = req.user as IUserModel;

    if (!user) {
        throw new ApiAccessDeniedError({ message: 'User is not authorized' });
    }

    const accessTypeVerificationResult = userService.verifyAccessType(user.accessType);
    if (!accessTypeVerificationResult.isAllowed) {
        await authService.signOut(req);

        throw new ApiAccessDeniedError({
            message: `Your account is ${accessTypeVerificationResult.status}`,
        });
    } else {
        next();
    }
}

export { authorizationMiddleware };
