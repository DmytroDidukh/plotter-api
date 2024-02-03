import { Service } from 'typedi';

import { UserModel } from 'models/user.model';
import { ISignUpUserDto, IUpdateUserDto, IUserModel } from 'types/interfaces/user';

@Service()
class UserRepository {
    getByEmail(email: string): Promise<IUserModel | null> {
        return UserModel.findOne({ email }).lean();
    }

    getById(id: string): Promise<IUserModel | null> {
        return UserModel.findById({ _id: id }).lean();
    }

    getByUsernameOrEmail(user: Partial<ISignUpUserDto>): Promise<IUserModel | null> {
        return UserModel.findOne({
            $or: [{ email: user.email }, { username: user.username }],
        }).lean();
    }

    create(user: Omit<IUserModel, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUserModel> {
        return new UserModel(user).save();
    }

    updateOneField<T extends keyof Omit<IUserModel, '_id'>>(
        id: string,
        fieldName: T,
        fieldValue: IUserModel[T],
    ): Promise<IUserModel> {
        return UserModel.findOneAndUpdate(
            { _id: id },
            { [fieldName]: fieldValue },
            { new: true },
        ).lean();
    }

    update(id: string, data: IUpdateUserDto): Promise<IUserModel> {
        return UserModel.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
    }
}

export { UserRepository };
