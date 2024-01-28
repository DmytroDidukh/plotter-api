import connectEnsureLogin from 'connect-ensure-login';

import { HTTP_METHODS, RouteConfigurator } from 'configurators/index';
import { authController } from 'controllers/auth';
import { bannedUserMiddleware, validate } from 'middleware/index';
import { authValidator } from 'middleware/validators/auth-validator';

const routeConfigurator = new RouteConfigurator();

// SIGN-UP
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-up',
    ...authValidator.signUpSchema,
    validate,
    authController.signUp,
);

// SIGN-IN
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-in',
    ...authValidator.signInSchema,
    validate,
    authController.signIn,
);

// SIGN-OUT
routeConfigurator.registerRoute(
    HTTP_METHODS.POST,
    '/sign-out',
    connectEnsureLogin.ensureLoggedIn('/v1/auth-error'),
    bannedUserMiddleware,
    authController.signOut,
);

// TODO: reset password route

const router = routeConfigurator.getRouter();

export default router;
