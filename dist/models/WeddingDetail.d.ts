import { Document, Types } from 'mongoose';
export interface IBrideGroom {
    fullName: string;
    avatar?: string;
    shortBio?: string;
    familyInfo?: string;
    socialLinks?: Record<string, string>;
}
export interface IWeddingEvent {
    title: string;
    type: 'ceremony' | 'reception' | 'party';
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
export declare const WeddingDetail: import("mongoose").Model<IWeddingDetail, {}, {}, {}, Document<unknown, {}, IWeddingDetail> & IWeddingDetail & {
    _id: Types.ObjectId;
}, any>;
//# sourceMappingURL=WeddingDetail.d.ts.map