import { BaseRepository } from "./BaseRepository";
import { Guest, IGuest } from "../models/Guest";

export class GuestRepository extends BaseRepository<IGuest> {
  constructor() {
    super(Guest);
  }

  async findByWeddingId(weddingId: string): Promise<IGuest[]> {
    return this.findAll({ weddingId, isActive: true });
  }

  async findByEmail(email: string): Promise<IGuest | null> {
    return this.findOne({ email, isActive: true });
  }

  async updateAttendanceStatus(
    id: string,
    status: string
  ): Promise<IGuest | null> {
    return this.update(id, {
      attendanceStatus: status,
      respondedAt: new Date(),
    });
  }
}
