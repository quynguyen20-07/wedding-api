import { CreateWeddingData, UpdateWeddingData } from '@/types/wedding';
import { IWedding } from '@/models/Wedding';
export declare class WeddingService {
    private weddingRepository;
    constructor();
    createWedding(userId: string, data: CreateWeddingData): Promise<IWedding>;
    getUserWeddings(userId: string): Promise<IWedding[]>;
    getWeddingById(id: string, userId?: string): Promise<IWedding | null>;
    getWeddingBySlug(slug: string): Promise<IWedding | null>;
    updateWedding(id: string, userId: string, data: UpdateWeddingData): Promise<IWedding | null>;
    deleteWedding(id: string, userId: string): Promise<IWedding | null>;
    publishWedding(id: string, userId: string): Promise<IWedding | null>;
    unpublishWedding(id: string, userId: string): Promise<IWedding | null>;
    searchWeddings(query: string, userId?: string): Promise<IWedding[]>;
}
//# sourceMappingURL=WeddingService.d.ts.map