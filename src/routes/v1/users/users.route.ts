import connectEnsureLogin from 'connect-ensure-login';
import { RouteConfigurator } from '@api-modules/configurators';
import { HTTP_METHODS } from '@api-modules/consts/api';

import { userController } from 'controllers/user';
import {
    authorizationMiddleware,
    updateAccessTypeMiddleware,
    validationMiddleware,
} from 'middleware/index';
import { UserValidator } from 'middleware/validators/user-validator';

const routeConfigurator = new RouteConfigurator();

// MY PROFILE
routeConfigurator.registerRoute(
    HTTP_METHODS.GET,
    '/me',
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    authorizationMiddleware,
    userController.myProfile,
);

// UPDATE USER
routeConfigurator.registerRoute(
    HTTP_METHODS.PUT,
    '/:id',
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    authorizationMiddleware,
    validationMiddleware(UserValidator.updateSchema),
    userController.updateMe,
);

// DELETE USER
routeConfigurator.registerRoute(
    HTTP_METHODS.DELETE,
    '/:id',
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    authorizationMiddleware,
    validationMiddleware(UserValidator.deleteSchema),
    userController.deleteMe,
);

// UPDATE ACCESS TYPE
routeConfigurator.registerRoute(
    HTTP_METHODS.PUT,
    '/access-type/:id',
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    authorizationMiddleware,
    validationMiddleware(UserValidator.updateAccessTypeSchema),
    updateAccessTypeMiddleware,
    userController.updateAccessType,
);

const router = routeConfigurator.getRouter();

export default router;
