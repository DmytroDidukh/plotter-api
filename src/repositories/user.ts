import { Service } from 'typedi';

import { UserModel } from 'models/user';
import { ISignUpUserDto, IUpdateUserDto, IUserModel } from 'types/interfaces/user';

@Service()
export class UserRepository {
    async getByEmail(email: string): Promise<IUserModel | null> {
        return UserModel.findOne({ email }).lean();
    }

    async getById(id: string): Promise<IUserModel | null> {
        return UserModel.findById({ _id: id }).lean();
    }

    async getByUsernameOrEmail(user: Partial<ISignUpUserDto>): Promise<IUserModel | null> {
        return UserModel.findOne({
            $or: [{ email: user.email }, { username: user.username }],
        }).lean();
    }

    async create(user: Omit<IUserModel, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUserModel> {
        return new UserModel(user).save();
    }

    async updateOneField<T extends keyof Omit<IUserModel, '_id'>>(
        id: string,
        fieldName: T,
        fieldValue: IUserModel[T],
    ): Promise<IUserModel> {
        await UserModel.updateOne({ _id: id }, { [fieldName]: fieldValue });
        return this.getById(id);
    }

    async update(id: string, data: IUpdateUserDto): Promise<IUserModel> {
        await UserModel.updateOne({ _id: id }, data);
        return this.getById(id);
    }
}
