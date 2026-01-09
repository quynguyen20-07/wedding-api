import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: any;
}
/**
 * ===============================
 * EXPRESS – AUTH REQUIRED
 * ===============================
 */
export declare const authenticate: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
/**
 * ===============================
 * GRAPHQL – AUTH REQUIRED
 * ===============================
 */
export declare const authenticateGraphQL: (context: any) => Promise<import("mongoose").Document<unknown, {}, import("../models/User").IUser> & import("../models/User").IUser & {
    _id: import("mongoose").Types.ObjectId;
}>;
/**
 * ===============================
 * GRAPHQL – AUTH OPTIONAL
 * ===============================
 */
export declare const authOptionalFriendlyGraphQL: (context: any) => Promise<(import("mongoose").Document<unknown, {}, import("../models/User").IUser> & import("../models/User").IUser & {
    _id: import("mongoose").Types.ObjectId;
}) | null>;
/**
 * ===============================
 * ROLE AUTHORIZATION (EXPRESS)
 * ===============================
 */
export declare const authorize: (...roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map