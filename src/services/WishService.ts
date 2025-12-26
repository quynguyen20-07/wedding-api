import { Types } from "mongoose";

import { WeddingRepository } from "../repositories/WeddingRepository";
import { IWish, Wish } from "../models/Wish";
import { AppError } from "../utils/AppError";

export interface WishInput {
  guestName: string;
  message: string;
}

export class WishService {
  private weddingRepository: WeddingRepository;

  constructor() {
    this.weddingRepository = new WeddingRepository();
  }

  async addWish(weddingId: string, wishData: WishInput): Promise<IWish> {
    // Check if wedding exists and is published
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.status !== "published") {
      throw new AppError("Wedding not found", 404);
    }

    const wish = await Wish.create({
      weddingId: new Types.ObjectId(weddingId),
      guestName: wishData.guestName,
      message: wishData.message,
      isApproved: false, // Needs admin approval for public display
    });

    return wish;
  }

  async getWeddingWishes(
    weddingId: string,
    userId?: string,
    approvedOnly: boolean = true
  ): Promise<IWish[]> {
    const filter: any = { weddingId, isActive: true };

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

    const wishes = await Wish.find(filter).sort({ createdAt: -1 });

    return wishes;
  }

  async approveWish(id: string, userId: string): Promise<IWish | null> {
    const wish = await Wish.findById(id);
    if (!wish) {
      throw new AppError("Wish not found", 404);
    }

    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(
      wish.weddingId.toString()
    );
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const approvedWish = await Wish.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    return approvedWish;
  }

  async deleteWish(id: string, userId: string): Promise<IWish | null> {
    const wish = await Wish.findById(id);
    if (!wish) {
      throw new AppError("Wish not found", 404);
    }

    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(
      wish.weddingId.toString()
    );
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const deletedWish = await Wish.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return deletedWish;
  }

  async getWishStats(
    weddingId: string,
    userId: string
  ): Promise<{ total: number; approved: number; pending: number }> {
    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const [total, approved] = await Promise.all([
      Wish.countDocuments({ weddingId, isActive: true }),
      Wish.countDocuments({ weddingId, isActive: true, isApproved: true }),
    ]);

    return {
      total,
      approved,
      pending: total - approved,
    };
  }
}
