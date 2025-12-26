import { Document, Types } from 'mongoose';
export interface IGuest extends Document {
    weddingId: Types.ObjectId;
    fullName: string;
    email?: string;
    phone?: string;
    relationship?: string;
    numberOfGuests: number;
    attendanceStatus: 'pending' | 'confirmed' | 'declined';
    dietaryRestrictions?: string;
    message?: string;
    respondedAt?: Date;
    tableNumber?: string;
    isActive: boolean;
}
export declare const Guest: import("mongoose").Model<IGuest, {}, {}, {}, Document<unknown, {}, IGuest> & IGuest & {
    _id: Types.ObjectId;
}, any>;
//# sourceMappingURL=Guest.d.ts.map