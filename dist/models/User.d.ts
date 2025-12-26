import { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    avatar?: string;
    role: "user" | "admin";
    isActive: boolean;
    lastLogin?: Date;
    refreshToken?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser> & IUser & {
    _id: import("mongoose").Types.ObjectId;
}, any>;
//# sourceMappingURL=User.d.ts.map