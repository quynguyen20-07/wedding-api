import { Types } from "mongoose";

import { IWeddingDetail, WeddingDetail } from "../models/WeddingDetail";
import { BaseRepository } from "./BaseRepository";
import { ICreateWeddingEvent } from "../types";

export class WeddingDetailRepository extends BaseRepository<IWeddingDetail> {
  constructor() {
    super(WeddingDetail);
  }

  async findByWeddingId(weddingId: string) {
    return this.model.findOne({ weddingId });
  }

  async addEvent(weddingId: string, eventData: ICreateWeddingEvent) {
    return this.model.findOneAndUpdate(
      { weddingId },
      { $push: { weddingEvents: eventData } },
      { new: true, upsert: true }
    );
  }

  async findEventById(weddingId: string, eventId: string) {
    return this.model.findOne(
      {
        weddingId,
        "weddingEvents._id": new Types.ObjectId(eventId),
      },
      {
        "weddingEvents.$": 1,
      }
    );
  }

  async updateEvent(
    weddingId: string,
    eventId: string,
    updateData: Partial<ICreateWeddingEvent>
  ) {
    const setData = Object.fromEntries(
      Object.entries(updateData).map(([key, value]) => [
        `weddingEvents.$.${key}`,
        value,
      ])
    );

    return this.model.updateOne(
      {
        weddingId,
        "weddingEvents._id": eventId,
      },
      {
        $set: setData,
      }
    );
  }

  async deleteEvent(weddingId: string, eventId: string) {
    await this.model.updateOne(
      { weddingId },
      { $pull: { weddingEvents: { _id: new Types.ObjectId(eventId) } } }
    );

    return this.findByWeddingId(weddingId);
  }
}
