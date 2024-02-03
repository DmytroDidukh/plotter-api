import bcrypt from 'bcrypt';
import { Service } from 'typedi';

@Service()
class PasswordService {
    private readonly saltRounds: number;

    constructor(saltRounds = 12) {
        this.saltRounds = saltRounds;
    }

    async getSalt(): Promise<string> {
        return bcrypt.genSalt(this.saltRounds);
    }

    async hash(password: string): Promise<string> {
        const salt = await this.getSalt();
        return bcrypt.hash(password, salt);
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
}

export { PasswordService };
