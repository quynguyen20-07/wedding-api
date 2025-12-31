export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    lastLogin?: Date;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData extends LoginCredentials {
    fullName: string;
    phone?: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}
//# sourceMappingURL=auth.d.ts.map