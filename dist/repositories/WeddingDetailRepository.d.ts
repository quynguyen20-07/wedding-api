import { Types } from "mongoose";
import { IWeddingDetail } from "../models/WeddingDetail";
import { BaseRepository } from "./BaseRepository";
import { ICreateWeddingEvent } from "../types";
export declare class WeddingDetailRepository extends BaseRepository<IWeddingDetail> {
    constructor();
    findByWeddingId(weddingId: string): Promise<(import("mongoose").Document<unknown, {}, IWeddingDetail> & IWeddingDetail & {
        _id: Types.ObjectId;
    }) | null>;
    addEvent(weddingId: string, eventData: ICreateWeddingEvent): Promise<import("mongoose").Document<unknown, {}, IWeddingDetail> & IWeddingDetail & {
        _id: Types.ObjectId;
    }>;
    findEventById(weddingId: string, eventId: string): Promise<(import("mongoose").Document<unknown, {}, IWeddingDetail> & IWeddingDetail & {
        _id: Types.ObjectId;
    }) | null>;
    updateEvent(weddingId: string, eventId: string, updateData: Partial<ICreateWeddingEvent>): Promise<import("mongoose").UpdateWriteOpResult>;
    deleteEvent(weddingId: string, eventId: string): Promise<(import("mongoose").Document<unknown, {}, IWeddingDetail> & IWeddingDetail & {
        _id: Types.ObjectId;
    }) | null>;
}
//# sourceMappingURL=WeddingDetailRepository.d.ts.map