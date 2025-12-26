import { IWedding } from '@/models/Wedding';
import { BaseRepository } from './BaseRepository';
export declare class WeddingRepository extends BaseRepository<IWedding> {
    constructor();
    findByUserId(userId: string): Promise<IWedding[]>;
    findBySlug(slug: string): Promise<IWedding | null>;
    incrementViewCount(slug: string): Promise<IWedding | null>;
    publishWedding(id: string): Promise<IWedding | null>;
    unpublishWedding(id: string): Promise<IWedding | null>;
    searchWeddings(query: string, userId?: string): Promise<IWedding[]>;
}
//# sourceMappingURL=WeddingRepository.d.ts.map