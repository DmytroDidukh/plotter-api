import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ApiAccessDeniedError, ApiNotFoundError } from '@api-modules/errors';

import { USER_ROLES } from 'consts/user';
import { UserRepository } from 'repositories/user';
import { IUserModel } from 'types/interfaces';

// TODO: Consider moving it to userService since it used only in one place
async function checkPermissionToUpdateUserAccessType(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const userRepository = Container.get(UserRepository);

    const currentUser = req.user as IUserModel;
    const currentUserId = currentUser._id.toString();
    const targetUserId: string = req.params.id;

    const targetUser = await userRepository.getById(targetUserId);

    if (!targetUser) {
        throw new ApiNotFoundError({ resourceId: targetUserId, resourceName: 'user' });
    }

    if (currentUserId === targetUserId) {
        throw new ApiAccessDeniedError({
            message: 'You do not have permission to update your own access type',
        });
    }

    const isAdmin = currentUser.role === USER_ROLES.ADMIN;
    const isSuperAdmin = currentUser.role === USER_ROLES.SUPER_ADMIN;
    const isTargetAdmin = targetUser.role === USER_ROLES.ADMIN;
    const isTargetSuperAdmin = targetUser.role === USER_ROLES.SUPER_ADMIN;

    if ((isSuperAdmin || isAdmin) && !isTargetSuperAdmin) {
        next();
    } else if (isSuperAdmin && isTargetAdmin) {
        next();
    } else {
        throw new ApiAccessDeniedError({
            message: 'You do not have permission to update the user access type',
        });
    }
}

export { checkPermissionToUpdateUserAccessType };
