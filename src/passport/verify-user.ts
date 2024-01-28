import { ApiAccessDeniedError, ApiSignInCredentialsError } from '@api-modules/errors';

import { userRepository } from 'repositories/user';
import { passwordService } from 'services/password';
import { userService } from 'services/user';
import { IUserModel } from 'types/interfaces';

async function verifyUser(
    emailOrUsername: string,
    password: string,
    done: (error: any, user?: IUserModel) => void,
) {
    try {
        const user = await userRepository.getByAny({
            email: emailOrUsername,
            username: emailOrUsername,
        });

        if (!user) {
            return done(new ApiSignInCredentialsError());
        }

        const isValidPassword = await passwordService.compare(password, user.hash);
        if (!isValidPassword) {
            return done(new ApiSignInCredentialsError());
        }

        // TODO: Add is inactive user (deleted)
        const isBanned = userService.checkBanStatus(user.accessType);
        if (isBanned) {
            return done(new ApiAccessDeniedError({ message: 'Current user is banned' }));
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}

export { verifyUser };
