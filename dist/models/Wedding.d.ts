import { Document, Types } from "mongoose";
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
export declare const Wedding: import("mongoose").Model<IWedding, {}, {}, {}, Document<unknown, {}, IWedding> & IWedding & {
    _id: Types.ObjectId;
}, any>;
//# sourceMappingURL=Wedding.d.ts.map