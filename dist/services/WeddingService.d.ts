import { CreateWeddingData, UpdateWeddingData } from "../types";
import { IWedding } from "../models/Wedding";
import { IUser } from "../models/User";
export declare class WeddingService {
    private weddingRepository;
    constructor();
    createWedding(user: IUser, data: CreateWeddingData): Promise<IWedding>;
    getUserWeddings(user?: IUser): Promise<IWedding[]>;
    getWeddings(): Promise<IWedding[]>;
    getWeddingById(id: string, user?: IUser): Promise<IWedding | null>;
    getWeddingBySlug(slug: string, user?: IUser | null): Promise<IWedding | null>;
    updateWedding(id: string, user: IUser, data: UpdateWeddingData): Promise<IWedding | null>;
    deleteWedding(id: string, user?: IUser): Promise<IWedding | null>;
    publishWedding(id: string, user?: IUser): Promise<IWedding | null>;
    unpublishWedding(id: string, user?: IUser): Promise<IWedding | null>;
    searchWeddings(query: string, userId?: string): Promise<IWedding[]>;
}
//# sourceMappingURL=WeddingService.d.ts.map