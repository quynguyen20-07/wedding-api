import { RegisterData, AuthTokens, LoginCredentials } from "../types";
import { IUser } from "../models/User";
export declare class AuthService {
    private userRepository;
    constructor();
    register(data: RegisterData): Promise<{
        user: IUser;
        tokens: AuthTokens;
    }>;
    login(credentials: LoginCredentials): Promise<{
        user: IUser;
        tokens: AuthTokens;
    }>;
    logout(userId: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    private generateTokens;
}
//# sourceMappingURL=AuthService.d.ts.map