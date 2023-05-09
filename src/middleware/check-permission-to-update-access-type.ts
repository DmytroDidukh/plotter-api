import { Request, Response, NextFunction } from 'express';
import { USER_ACCESS_TYPES } from 'constants/user';
import { ApiAccessDeniedError, ApiNotFoundError } from 'api/error';
import { userRepository } from 'repositories/user';
import { IUserModel } from 'types/interfaces';

async function checkPermissionToUpdateAccessType(req: Request, res: Response, next: NextFunction) {
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

    const isAdmin = currentUser.accessType === USER_ACCESS_TYPES.ADMIN;
    const isSuperAdmin = currentUser.accessType === USER_ACCESS_TYPES.SUPER_ADMIN;
    const isTargetAdmin = targetUser.accessType === USER_ACCESS_TYPES.ADMIN;
    const isTargetSuperAdmin = targetUser.accessType === USER_ACCESS_TYPES.SUPER_ADMIN;

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

export { checkPermissionToUpdateAccessType };
