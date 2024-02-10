import { Service } from 'typedi';

import { UserModel } from 'models/user.model';
import { IUserModel } from 'types/interfaces/user';

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

    async findByOriginId(originId: string): Promise<IUserModel | null> {
        return UserModel.findOne({ originId }).lean();
    }
}

export { UserRepository };
