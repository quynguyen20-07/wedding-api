"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishService = void 0;
const mongoose_1 = require("mongoose");
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const Wish_1 = require("../models/Wish");
const AppError_1 = require("../utils/AppError");
class WishService {
    constructor() {
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
    }
    async addWish(weddingId, wishData) {
        // Check if wedding exists and is published
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.status !== "published") {
            throw new AppError_1.AppError("Wedding not found", 404);
        }
        const wish = await Wish_1.Wish.create({
            weddingId: new mongoose_1.Types.ObjectId(weddingId),
            guestName: wishData.guestName,
            message: wishData.message,
            isApproved: false, // Needs admin approval for public display
        });
        return wish;
    }
    async getWeddingWishes(weddingId, userId, approvedOnly = true) {
        const filter = { weddingId, isActive: true };
        if (approvedOnly) {
            filter.isApproved = true;
        }
        // If user is owner, they can see all wishes (including unapproved)
        if (userId) {
            const wedding = await this.weddingRepository.findById(weddingId);
            if (wedding && wedding.userId.toString() === userId) {
                delete filter.isApproved; // Show all wishes to owner
            }
        }
        const wishes = await Wish_1.Wish.find(filter).sort({ createdAt: -1 });
        return wishes;
    }
    async approveWish(id, userId) {
        const wish = await Wish_1.Wish.findById(id);
        if (!wish) {
            throw new AppError_1.AppError("Wish not found", 404);
        }
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(wish.weddingId.toString());
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        const approvedWish = await Wish_1.Wish.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        return approvedWish;
    }
    async deleteWish(id, userId) {
        const wish = await Wish_1.Wish.findById(id);
        if (!wish) {
            throw new AppError_1.AppError("Wish not found", 404);
        }
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(wish.weddingId.toString());
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        const deletedWish = await Wish_1.Wish.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return deletedWish;
    }
    async getWishStats(weddingId, userId) {
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        const [total, approved] = await Promise.all([
            Wish_1.Wish.countDocuments({ weddingId, isActive: true }),
            Wish_1.Wish.countDocuments({ weddingId, isActive: true, isApproved: true }),
        ]);
        return {
            total,
            approved,
            pending: total - approved,
        };
    }
}
exports.WishService = WishService;
//# sourceMappingURL=WishService.js.map