"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const User_1 = require("../models/User");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_1.User);
    }
    async findByEmail(email) {
        return this.findOne({ email, isActive: true });
    }
    async updateRefreshToken(userId, refreshToken) {
        return this.update(userId, {
            refreshToken,
            lastLogin: new Date(),
        });
    }
    async clearRefreshToken(userId) {
        return this.update(userId, { refreshToken: null });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map