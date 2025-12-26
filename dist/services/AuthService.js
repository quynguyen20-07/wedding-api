"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../utils/AppError");
class AuthService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError("Email already registered", 400);
        }
        const user = await this.userRepository.create({
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            phone: data.phone,
        });
        const tokens = this.generateTokens({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        await this.userRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);
        return { user, tokens };
    }
    async login(credentials) {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const isValidPassword = await user.comparePassword(credentials.password);
        if (!isValidPassword) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const tokens = this.generateTokens({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        await this.userRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);
        return { user, tokens };
    }
    async logout(userId) {
        await this.userRepository.clearRefreshToken(userId);
    }
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new AppError_1.AppError("Refresh token required", 401);
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await this.userRepository.findById(decoded.userId);
            if (!user || user.refreshToken !== refreshToken) {
                throw new AppError_1.AppError("Invalid refresh token", 401);
            }
            const tokens = this.generateTokens({
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            });
            await this.userRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new AppError_1.AppError("Invalid refresh token", 401);
        }
    }
    generateTokens(payload) {
        const expiresIn = process.env.JWT_EXPIRES_IN
            ? parseInt(process.env.JWT_EXPIRES_IN, 10)
            : undefined;
        const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN
            ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10)
            : undefined;
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: refreshExpiresIn,
        });
        return { accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map