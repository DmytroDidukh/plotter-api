import { ApiAccessDeniedError, ApiSignInCredentialsError } from 'api/error';
import { passwordService } from 'services/password';
import { userRepository } from 'repositories/user';
import { userService } from 'services/user';

async function verifyUser(emailOrUsername, password, done) {
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
