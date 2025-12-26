import { Schema, model, Document, Types } from 'mongoose';


export interface IBankAccount extends Document {
  weddingId: Types.ObjectId;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  qrCodeUrl?: string;
  isActive: boolean;
}

const BankAccountSchema = new Schema<IBankAccount>(
  {
    weddingId: {
      type: Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    branch: String,
    qrCodeUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BankAccount = model<IBankAccount>('BankAccount', BankAccountSchema);