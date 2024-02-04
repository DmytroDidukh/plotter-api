import connectEnsureLogin from 'connect-ensure-login';
import { RouteConfigurator } from '@api-modules/configurators';
import { HTTP_METHODS } from '@api-modules/consts/api';

import { authController } from 'controllers/auth.controller';
import { authorizationMiddleware, validationMiddleware } from 'middleware/index';
import { AuthValidator } from 'middleware/validators/auth.validator';

const routeConfigurator = new RouteConfigurator();

// SIGN-UP
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-up',
    ...AuthValidator.signUpSchema,
    validationMiddleware(AuthValidator.signUpSchema),
    authController.signUp,
);

// SIGN-IN
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-in',
    ...AuthValidator.signInSchema,
    validationMiddleware(AuthValidator.signInSchema),
    authController.signIn,
);

// GOOGLE AUTH
routeConfigurator.registerRoute(HTTP_METHODS.GET, '/google', authController.googleAuth);
routeConfigurator.registerRoute(HTTP_METHODS.GET, '/google/callback', authController.googleSignIn);

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
