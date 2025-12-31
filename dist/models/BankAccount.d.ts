import { Document, Types } from 'mongoose';
export interface IBankAccount extends Document {
    weddingId: Types.ObjectId;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch?: string;
    qrCodeUrl?: string;
    isActive: boolean;
}
export declare const BankAccount: import("mongoose").Model<IBankAccount, {}, {}, {}, Document<unknown, {}, IBankAccount> & IBankAccount & {
    _id: Types.ObjectId;
}, any>;
//# sourceMappingURL=BankAccount.d.ts.map