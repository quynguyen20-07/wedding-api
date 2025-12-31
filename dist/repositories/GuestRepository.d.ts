import { BaseRepository } from "./BaseRepository";
import { IGuest } from "../models/Guest";
export declare class GuestRepository extends BaseRepository<IGuest> {
    constructor();
    findByWeddingId(weddingId: string): Promise<IGuest[]>;
    findByEmail(email: string): Promise<IGuest | null>;
    updateAttendanceStatus(id: string, status: string): Promise<IGuest | null>;
}
//# sourceMappingURL=GuestRepository.d.ts.map