import { IWish } from "../models/Wish";
export interface WishInput {
    guestName: string;
    message: string;
}
export declare class WishService {
    private weddingRepository;
    constructor();
    addWish(weddingId: string, wishData: WishInput): Promise<IWish>;
    getWeddingWishes(weddingId: string, userId?: string, approvedOnly?: boolean): Promise<IWish[]>;
    approveWish(id: string, userId: string): Promise<IWish | null>;
    deleteWish(id: string, userId: string): Promise<IWish | null>;
    getWishStats(weddingId: string, userId: string): Promise<{
        total: number;
        approved: number;
        pending: number;
    }>;
}
//# sourceMappingURL=WishService.d.ts.map