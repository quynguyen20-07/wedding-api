import { ICreateWeddingEvent } from "../types";
import { IUser } from "../models/User";
export declare class WeddingDetailService {
    private weddingRepository;
    private weddingDetailRepository;
    constructor();
    private assertCanAccessWedding;
    getWeddingDetail(weddingId: string, user?: IUser): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateBride(weddingId: string, user: IUser, brideData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateGroom(weddingId: string, user: IUser, groomData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addLoveStory(weddingId: string, user: IUser, storyData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateLoveStory(weddingId: string, user: IUser, storyId: string, storyData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addWeddingEvent(weddingId: string, user: IUser, eventData: ICreateWeddingEvent): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateWeddingEvent(weddingId: string, eventId: string, user: IUser, data: Partial<ICreateWeddingEvent>): Promise<boolean>;
    deleteWeddingEvent(weddingId: string, eventId: string, user: IUser): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
//# sourceMappingURL=WeddingDetailService.d.ts.map