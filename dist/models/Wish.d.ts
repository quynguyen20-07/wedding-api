import { Document, Types } from 'mongoose';
export interface IWish extends Document {
    weddingId: Types.ObjectId;
    guestName: string;
    message: string;
    isApproved: boolean;
    isActive: boolean;
}
export declare const Wish: import("mongoose").Model<IWish, {}, {}, {}, Document<unknown, {}, IWish> & IWish & {
    _id: Types.ObjectId;
}, any>;
//# sourceMappingURL=Wish.d.ts.map