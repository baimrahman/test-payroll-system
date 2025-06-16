import { IHashService } from "@application/services";
import * as bcrypt from 'bcrypt';

export class HashService implements IHashService {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}