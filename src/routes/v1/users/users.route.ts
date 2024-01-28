import connectEnsureLogin from 'connect-ensure-login';
import { RouteConfigurator } from '@api-modules/configurators/route-configurator';
import { HTTP_METHODS } from '@api-modules/consts/api';

import { userController } from 'controllers/user';
import {
    bannedUserMiddleware,
    checkPermissionToUpdateUserAccessType,
    validate,
} from 'middleware/index';
import { UserValidator } from 'middleware/validators/user-validator';

const routeConfigurator = new RouteConfigurator();

// MY PROFILE
routeConfigurator.registerRoute(
    HTTP_METHODS.GET,
    '/me',
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    bannedUserMiddleware,
    userController.myProfile,
);

// UPDATE USER
routeConfigurator.registerRoute(
    HTTP_METHODS.PUT,
    '/:id',
    ...UserValidator.updateSchema,
    validate,
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    bannedUserMiddleware,
    userController.updateMe,
);

// DELETE USER
routeConfigurator.registerRoute(
    HTTP_METHODS.DELETE,
    '/:id',
    ...UserValidator.deleteSchema,
    validate,
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    bannedUserMiddleware,
    userController.deleteMe,
);

// UPDATE ACCESS TYPE
routeConfigurator.registerRoute(
    HTTP_METHODS.PUT,
    '/access-type/:id',
    ...UserValidator.updateAccessTypeSchema,
    validate,
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    checkPermissionToUpdateUserAccessType,
    userController.updateAccessType,
);

const router = routeConfigurator.getRouter();

export default router;
