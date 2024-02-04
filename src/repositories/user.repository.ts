import { Service } from 'typedi';

import { UserModel } from 'models/user.model';
import { ISignUpUserInput, IUserModel } from 'types/interfaces/user';

import { BasicRepository } from './basic.repository';

@Service()
class UserRepository extends BasicRepository<IUserModel> {
    entityName = 'user';

    constructor() {
        super(UserModel);
    }

    findByEmail(email: string): Promise<IUserModel | null> {
        return UserModel.findOne({ email }).lean();
    }

    findByUsernameOrEmail(user: Partial<ISignUpUserInput>): Promise<IUserModel | null> {
        return UserModel.findOne({
            $or: [{ email: user.email }, { username: user.username }],
        }).lean();
    }
}

export { UserRepository };
