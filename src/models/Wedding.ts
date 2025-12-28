import { Schema, model, Document, Types } from "mongoose";

export interface IWedding extends Document {
  userId: Types.ObjectId;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  language: "vi" | "en";
  weddingDate: Date;
  themeSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontHeading: string;
    fontBody: string;
    backgroundMusic?: string;
  };
  viewCount: number;
  publishedAt?: Date;
  isActive: boolean;
}

const WeddingSchema = new Schema<IWedding>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    weddingDate: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    language: {
      type: String,
      enum: ["vi", "en"],
      default: "vi",
    },
    themeSettings: {
      primaryColor: {
        type: String,
        default: "#F7E7CE",
      },
      secondaryColor: {
        type: String,
        default: "#F4B6C2",
      },
      fontHeading: {
        type: String,
        default: "Playfair Display",
      },
      fontBody: {
        type: String,
        default: "Inter",
      },
      backgroundMusic: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    publishedAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

WeddingSchema.index({ userId: 1 });
WeddingSchema.index({ slug: 1 });
WeddingSchema.index({ status: 1 });

export const Wedding = model<IWedding>("Wedding", WeddingSchema);
