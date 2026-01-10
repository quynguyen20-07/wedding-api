import HttpStatus from "http-status";

import { WeddingDetailRepository } from "../repositories/WeddingDetailRepository";
import { WeddingRepository } from "../repositories/WeddingRepository";
import { WeddingDetail } from "../models/WeddingDetail";
import { ICreateWeddingEvent } from "../types";
import { AppError } from "../utils/AppError";
import { IUser } from "../models/User";

export class WeddingDetailService {
  private weddingRepository: WeddingRepository;
  private weddingDetailRepository: WeddingDetailRepository;

  constructor() {
    this.weddingRepository = new WeddingRepository();
    this.weddingDetailRepository = new WeddingDetailRepository();
  }

  // ======================
  // AUTHORIZATION
  // ======================
  private async assertCanAccessWedding(weddingId: string, user: IUser) {
    if (user.role === "admin") return;

    const wedding = await this.weddingRepository.findById(weddingId);

    if (!wedding) {
      throw new AppError("Wedding not found", HttpStatus.NOT_FOUND);
    }

    if (wedding.userId.toString() !== user._id.toString()) {
      throw new AppError("Forbidden", HttpStatus.FORBIDDEN);
    }
  }

  // ======================
  // GET
  // ======================
  async getWeddingDetail(weddingId: string, user?: IUser) {
    if (user) {
      await this.assertCanAccessWedding(weddingId, user);
    }

    const weddingDetail = await WeddingDetail.findOne({ weddingId });

    if (!weddingDetail) {
      throw new AppError("Wedding detail not found", HttpStatus.NOT_FOUND);
    }

    return weddingDetail;
  }

  // ======================
  // UPDATE BRIDE
  // ======================
  async updateBride(weddingId: string, user: IUser, brideData: any) {
    await this.assertCanAccessWedding(weddingId, user);

    return WeddingDetail.findOneAndUpdate(
      { weddingId },
      { $set: { bride: brideData } },
      { new: true, upsert: true }
    );
  }

  // ======================
  // UPDATE GROOM
  // ======================
  async updateGroom(weddingId: string, user: IUser, groomData: any) {
    await this.assertCanAccessWedding(weddingId, user);

    return WeddingDetail.findOneAndUpdate(
      { weddingId },
      { $set: { groom: groomData } },
      { new: true, upsert: true }
    );
  }

  // ======================
  // LOVE STORY
  // ======================
  async addLoveStory(weddingId: string, user: IUser, storyData: any) {
    await this.assertCanAccessWedding(weddingId, user);

    return WeddingDetail.findOneAndUpdate(
      { weddingId },
      { $push: { loveStories: storyData } },
      { new: true, upsert: true }
    );
  }

  // ======================
  // UPDATE LOVE STORY BY ID
  // ======================
  async updateLoveStory(
    weddingId: string,
    user: IUser,
    storyId: string,
    storyData: any
  ) {
    await this.assertCanAccessWedding(weddingId, user);

    const weddingDetail = await WeddingDetail.findOneAndUpdate(
      {
        weddingId,
        "loveStories._id": storyId,
      },
      {
        $set: {
          "loveStories.$": {
            _id: storyId,
            ...storyData,
          },
        },
      },
      { new: true }
    );

    if (!weddingDetail) {
      throw new AppError("Love story not found", HttpStatus.NOT_FOUND);
    }

    return weddingDetail;
  }

  // ======================
  // ADD EVENT
  // ======================
  async addWeddingEvent(
    weddingId: string,
    user: IUser,
    eventData: ICreateWeddingEvent
  ) {
    await this.assertCanAccessWedding(weddingId, user);

    const weddingDetail = await this.weddingDetailRepository.addEvent(
      weddingId,
      eventData
    );

    if (!weddingDetail) {
      throw new AppError("Wedding detail not found", HttpStatus.NOT_FOUND);
    }

    return weddingDetail;
  }

  // ======================
  // UPDATE EVENT
  // ======================
  async updateWeddingEvent(
    weddingId: string,
    eventId: string,
    user: IUser,
    data: Partial<ICreateWeddingEvent>
  ) {
    await this.assertCanAccessWedding(weddingId, user);

    const event = await this.weddingDetailRepository.findEventById(
      weddingId,
      eventId
    );

    if (!event) {
      throw new AppError("Wedding event not found", HttpStatus.NOT_FOUND);
    }

    await this.weddingDetailRepository.updateEvent(weddingId, eventId, data);

    return true;
  }

  async deleteWeddingEvent(weddingId: string, eventId: string, user: IUser) {
    await this.assertCanAccessWedding(weddingId, user);

    const event = await this.weddingDetailRepository.findEventById(
      weddingId,
      eventId
    );

    if (!event) {
      throw new AppError("Wedding event not found", HttpStatus.NOT_FOUND);
    }

    const weddingDetail = await this.weddingDetailRepository.deleteEvent(
      weddingId,
      eventId
    );

    if (!weddingDetail) {
      throw new AppError("Wedding detail not found", HttpStatus.NOT_FOUND);
    }

    return weddingDetail;
  }
}
