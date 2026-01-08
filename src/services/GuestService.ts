import HttpStatus from "http-status";

import { WeddingRepository } from "../repositories/WeddingRepository";
import { GuestRepository } from "../repositories/GuestRepository";
import { GuestStats, RSVPInput } from "../types";
import { AppError } from "../utils/AppError";

export class GuestService {
  private guestRepository: GuestRepository;
  private weddingRepository: WeddingRepository;

  constructor() {
    this.guestRepository = new GuestRepository();
    this.weddingRepository = new WeddingRepository();
  }

  async submitRSVP(weddingId: string, rsvp: RSVPInput) {
    // Check if wedding exists and is published
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.status !== "published") {
      throw new AppError("Wedding not found", HttpStatus.NOT_FOUND);
    }

    const guest = await this.guestRepository.create({
      weddingId: weddingId as any,
      ...rsvp,
      respondedAt: new Date(),
    });

    return guest;
  }

  async getWeddingGuests(weddingId: string, userId: string) {
    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", HttpStatus.FORBIDDEN);
    }

    return this.guestRepository.findByWeddingId(weddingId);
  }

  async getGuestStats(weddingId: string, userId: string): Promise<GuestStats> {
    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", HttpStatus.FORBIDDEN);
    }

    const guests = await this.guestRepository.findByWeddingId(weddingId);

    const stats: GuestStats = {
      total: guests.length,
      confirmed: guests.filter((g) => g.attendanceStatus === "confirmed")
        .length,
      pending: guests.filter((g) => g.attendanceStatus === "pending").length,
      declined: guests.filter((g) => g.attendanceStatus === "declined").length,
      totalGuests: guests.reduce((sum, guest) => sum + guest.numberOfGuests, 0),
    };

    return stats;
  }
}
