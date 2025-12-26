import { IUser } from '@/models/User';
import { BaseRepository } from './BaseRepository';
export declare class UserRepository extends BaseRepository<IUser> {
    constructor();
    findByEmail(email: string): Promise<IUser | null>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>;
    clearRefreshToken(userId: string): Promise<IUser | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map