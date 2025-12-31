export declare class WeddingDetailService {
    private weddingRepository;
    constructor();
    getWeddingDetail(weddingId: string, userId?: string): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateBride(weddingId: string, userId: string, brideData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateGroom(weddingId: string, userId: string, groomData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addLoveStory(weddingId: string, userId: string, storyData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addWeddingEvent(weddingId: string, userId: string, eventData: any): Promise<import("mongoose").Document<unknown, {}, import("../models/WeddingDetail").IWeddingDetail> & import("../models/WeddingDetail").IWeddingDetail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
//# sourceMappingURL=WeddingDetailService.d.ts.map