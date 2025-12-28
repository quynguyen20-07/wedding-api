import { Logger } from "winston";
import jwt from "jsonwebtoken";

import {
  RegisterData,
  AuthTokens,
  LoginCredentials,
  TokenPayload,
} from "../types";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";
import { IUser } from "../models/User";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(
    data: RegisterData
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already registered", 400);
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

    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken
    );

    return { user, tokens };
  }

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AppError("Không tìm thấy người dùng", 401);
    }

    const isValidPassword = await user.comparePassword(credentials.password);
    if (!isValidPassword) {
      throw new AppError("Mật khẩu không đúng", 401);
    }

    const tokens = this.generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await this.userRepository.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken
    );

    return { user, tokens };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.clearRefreshToken(userId);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new AppError("Refresh token required", 401);
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as TokenPayload;

      const user = await this.userRepository.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
      }

      const tokens = this.generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      await this.userRepository.updateRefreshToken(
        user._id.toString(),
        tokens.refreshToken
      );

      return tokens;
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  private generateTokens(payload: TokenPayload): AuthTokens {
    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret) {
      throw new AppError("JWT_SECRET is not configured", 500);
    }

    if (!jwtRefreshSecret) {
      throw new AppError("JWT_REFRESH_SECRET is not configured", 500);
    }

    const accessToken = jwt.sign(payload, jwtSecret, {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
      expiresIn: refreshExpiresIn as jwt.SignOptions["expiresIn"],
    });

    return { accessToken, refreshToken };
  }
}
