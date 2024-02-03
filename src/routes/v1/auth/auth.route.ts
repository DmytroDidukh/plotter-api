import connectEnsureLogin from 'connect-ensure-login';
import { RouteConfigurator } from '@api-modules/configurators';
import { HTTP_METHODS } from '@api-modules/consts/api';

import { authController } from 'controllers/auth';
import { authorizationMiddleware, validate } from 'middleware/index';
import { AuthValidator } from 'middleware/validators/auth-validator';

const routeConfigurator = new RouteConfigurator();

// SIGN-UP
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-up',
    ...AuthValidator.signUpSchema,
    validate,
    authController.signUp,
);

// SIGN-IN
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-in',
    ...AuthValidator.signInSchema,
    validate,
    authController.signIn,
);

// SIGN-OUT
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-out',
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    authorizationMiddleware,
    authController.signOut,
);

// TODO: reset password route

const router = routeConfigurator.getRouter();

export default router;
