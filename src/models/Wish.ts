import { Schema, model, Document, Types } from 'mongoose';


export interface IWish extends Document {
  weddingId: Types.ObjectId;
  guestName: string;
  message: string;
  isApproved: boolean;
  isActive: boolean;
}

const WishSchema = new Schema<IWish>(
  {
    weddingId: {
      type: Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

WishSchema.index({ weddingId: 1 });
WishSchema.index({ isApproved: 1 });

export const Wish = model<IWish>('Wish', WishSchema);