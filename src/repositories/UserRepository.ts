import { BaseRepository } from "./BaseRepository";
import { IUser, User } from "../models/User";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email, isActive: true });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<IUser | null> {
    return this.update(userId, {
      refreshToken,
      lastLogin: new Date(),
    });
  }

  async clearRefreshToken(userId: string): Promise<IUser | null> {
    return this.update(userId, { refreshToken: null });
  }
}
