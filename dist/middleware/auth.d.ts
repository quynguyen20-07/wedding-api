import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: any;
}
export declare const authenticate: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
export declare const authenticateGraphQL: (context: any) => Promise<import("mongoose").Document<unknown, {}, import("@/models/User").IUser> & import("@/models/User").IUser & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map