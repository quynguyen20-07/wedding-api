import { WeddingRepository } from "../repositories/WeddingRepository";
import { WeddingDetail } from "../models/WeddingDetail";
import { AppError } from "../utils/AppError";

export class WeddingDetailService {
  private weddingRepository: WeddingRepository;

  constructor() {
    this.weddingRepository = new WeddingRepository();
  }

  async getWeddingDetail(weddingId: string, userId?: string) {
    if (userId) {
      // Verify wedding ownership
      const wedding = await this.weddingRepository.findById(weddingId);
      if (!wedding || wedding.userId.toString() !== userId) {
        throw new AppError("Unauthorized", 403);
      }
    }

    const weddingDetail = await WeddingDetail.findOne({ weddingId });
    if (!weddingDetail) {
      throw new AppError("Wedding detail not found", 404);
    }

    return weddingDetail;
  }

  async updateBride(weddingId: string, userId: string, brideData: any) {
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const weddingDetail = await WeddingDetail.findOneAndUpdate(
      { weddingId },
      { $set: { bride: brideData } },
      { new: true, upsert: true }
    );

    return weddingDetail;
  }

  async updateGroom(weddingId: string, userId: string, groomData: any) {
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const weddingDetail = await WeddingDetail.findOneAndUpdate(
      { weddingId },
      { $set: { groom: groomData } },
      { new: true, upsert: true }
    );

    return weddingDetail;
  }

  async addLoveStory(weddingId: string, userId: string, storyData: any) {
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const weddingDetail = await WeddingDetail.findOneAndUpdate(
      { weddingId },
      { $push: { loveStories: storyData } },
      { new: true, upsert: true }
    );

    return weddingDetail;
  }

  async addWeddingEvent(weddingId: string, userId: string, eventData: any) {
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const weddingDetail = await WeddingDetail.findOneAndUpdate(
      { weddingId },
      { $push: { weddingEvents: eventData } },
      { new: true, upsert: true }
    );

    return weddingDetail;
  }
}
