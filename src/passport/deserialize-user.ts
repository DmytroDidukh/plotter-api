import { UserModel } from 'models/user';

async function deserializeUser(id: string, done: (error: any, user?: any) => void) {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
}

export { deserializeUser };
