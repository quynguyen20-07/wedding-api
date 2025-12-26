import { Schema, model, Document, Types } from 'mongoose';


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

const GuestSchema = new Schema<IGuest>(
  {
    weddingId: {
      type: Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    relationship: String,
    numberOfGuests: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    attendanceStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending',
    },
    dietaryRestrictions: String,
    message: String,
    respondedAt: Date,
    tableNumber: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

GuestSchema.index({ weddingId: 1 });
GuestSchema.index({ email: 1 });
GuestSchema.index({ attendanceStatus: 1 });

export const Guest = model<IGuest>('Guest', GuestSchema);