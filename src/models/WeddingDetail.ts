import { Schema, model, Document, Types } from "mongoose";

export interface IBrideGroom {
  fullName: string;
  avatar?: string;
  shortBio?: string;
  familyInfo?: string;
  socialLinks?: Record<string, string>;
}

export interface IWeddingEvent {
  title: string;
  type: "ceremony" | "reception" | "party";
  eventDate: Date;
  startTime?: string;
  endTime?: string;
  address: string;
  locationLat?: number;
  locationLng?: number;
  mapEmbedUrl?: string;
  description?: string;
}

export interface ILoveStory {
  title: string;
  content: string;
  storyDate?: Date;
  imageUrl?: string;
}

export interface IWeddingDetail extends Document {
  weddingId: Types.ObjectId;
  bride: IBrideGroom;
  groom: IBrideGroom;
  loveStories: ILoveStory[];
  weddingEvents: IWeddingEvent[];
}

const BrideGroomSchema = new Schema({
  fullName: { type: String, required: true },
  avatar: String,
  shortBio: String,
  familyInfo: String,
  socialLinks: { type: Map, of: String },
});

const WeddingEventSchema = new Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["ceremony", "reception", "party"],
    required: true,
  },
  eventDate: { type: Date, required: true },
  startTime: String,
  endTime: String,
  address: { type: String, required: true },
  locationLat: Number,
  locationLng: Number,
  mapEmbedUrl: String,
  description: String,
});

const LoveStorySchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  storyDate: Date,
  imageUrl: String,
});

const WeddingDetailSchema = new Schema<IWeddingDetail>(
  {
    weddingId: {
      type: Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
      unique: true,
    },
    bride: BrideGroomSchema,
    groom: BrideGroomSchema,
    loveStories: [LoveStorySchema],
    weddingEvents: [WeddingEventSchema],
  },
  {
    timestamps: true,
  }
);

export const WeddingDetail = model<IWeddingDetail>(
  "WeddingDetail",
  WeddingDetailSchema
);
