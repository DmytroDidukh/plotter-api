import { Profile as FacebookProfile } from 'passport-facebook';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Service } from 'typedi';
import { ApiAccessDeniedError } from '@api-modules/errors';

import { USER_ACCESS_TYPES, USER_AUTH_TYPES, USER_FIELDS_NAMES } from 'consts/user';
import { UserRepository } from 'repositories/user.repository';
import { PasswordService } from 'services/password.service';
import {
    ICreateFacebookUserInput,
    ICreateGoogleUserInput,
    ICreateUserInput,
    ISignUpUserInput,
    IUpdateUserInput,
    IUserDto,
    IUserModel,
} from 'types/interfaces/user';

interface IVerifyAccessTypeResult {
    isAllowed: boolean;
    status: USER_ACCESS_TYPES;
}

export interface IResponseDateMessage {
    message: string;
    irrevocablyDeletedAt?: string;
}

@Service()
class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
    ) {}

    async createUser(user: ISignUpUserInput): Promise<IUserModel> {
        const passwordHash = await this.passwordService.hash(user.password);
        const salt = await this.passwordService.getSalt();

        return this.userRepository.create<ICreateUserInput>({
            email: user.email,
            hash: passwordHash,
            salt,
        });
    }

    async createGoogleUser(profile: GoogleProfile): Promise<IUserModel> {
        return this.userRepository.create<ICreateGoogleUserInput>({
            originId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            profilePicture: profile.photos[0].value,
            authType: USER_AUTH_TYPES.GOOGLE,
        });
    }

    async createFacebookUser(profile: FacebookProfile): Promise<IUserModel> {
        return this.userRepository.create<ICreateFacebookUserInput>({
            originId: profile.id,
            email: profile.emails?.[0]?.value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            profilePicture: profile.photos?.[0]?.value,
            authType: USER_AUTH_TYPES.FACEBOOK,
        });
    }

    async updateMe(
        currentUserId: string,
        targetUserId: string,
        data: IUpdateUserInput,
    ): Promise<IUserDto> {
        const user = await this.userRepository.findByIdOrFail(targetUserId);

        const userId = UserService.getIdFromModel(user);
        if (currentUserId !== userId) {
            throw new ApiAccessDeniedError({ message: 'User can update only own data' });
        }

        const updatedUser = await this.userRepository.updateOne<IUpdateUserInput>(
            targetUserId,
            data,
        );

        return this.mapModelToDto(updatedUser);
    }

    async deleteMe(currentUserId: string, targetUserId: string): Promise<IResponseDateMessage> {
        const user = await this.userRepository.findByIdOrFail(targetUserId);

        const userId = UserService.getIdFromModel(user);
        if (currentUserId !== userId) {
            throw new ApiAccessDeniedError({ message: 'User can delete only own data' });
        }

        await this.userRepository.updateOneField(
            targetUserId,
            USER_FIELDS_NAMES.ACCESS_TYPE,
            USER_ACCESS_TYPES.DELETED,
        );
        // TODO: MOVE IT OUT
        const currentDate = new Date(); // current date
        currentDate.setDate(currentDate.getDate() + 30); // add 30 days to current date
        const irrevocablyDeletedAt = currentDate.toISOString();
        // TODO: Add checker script that runs around and check inactive users that should be deleted

        return { message: "You've successfully deleted your account", irrevocablyDeletedAt };
    }

    async updateAccessType(id: string, accessType: USER_ACCESS_TYPES): Promise<IUserDto> {
        await this.userRepository.findByIdOrFail(id);

        const updatedUser = await this.userRepository.updateOneFieldOrFail(
            id,
            USER_FIELDS_NAMES.ACCESS_TYPE,
            accessType,
        );

        return this.mapModelToDto(updatedUser);
    }

    mapModelToDto(user: IUserModel): IUserDto {
        return {
            id: user._id.toString(),
            originId: user.originId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            role: user.role,
            accessType: user.accessType,
            authType: user.authType,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }

    verifyAccessType(accessType: USER_ACCESS_TYPES): IVerifyAccessTypeResult {
        if (this.checkBannedStatus(accessType)) {
            return {
                isAllowed: false,
                status: USER_ACCESS_TYPES.BANNED,
            };
        }

        if (this.checkDeletedStatus(accessType)) {
            return {
                isAllowed: false,
                status: USER_ACCESS_TYPES.DELETED,
            };
        }

        if (this.checkInactiveStatus(accessType)) {
            return {
                isAllowed: false,
                status: USER_ACCESS_TYPES.INACTIVE,
            };
        }

        return {
            isAllowed: true,
            status: USER_ACCESS_TYPES.ACTIVE,
        };
    }

    checkBannedStatus(accessType: USER_ACCESS_TYPES): boolean {
        return accessType === USER_ACCESS_TYPES.BANNED;
    }

    checkDeletedStatus(accessType: USER_ACCESS_TYPES): boolean {
        return accessType === USER_ACCESS_TYPES.DELETED;
    }

    checkInactiveStatus(accessType: USER_ACCESS_TYPES): boolean {
        return accessType === USER_ACCESS_TYPES.INACTIVE;
    }

    static getIdFromModel(user: IUserModel): string {
        if (!user) {
            throw TypeError('You must pass a user');
        }

        return user._id.toString();
    }
}

export { UserService };
