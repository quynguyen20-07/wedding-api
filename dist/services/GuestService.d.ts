import { RSVPInput, GuestStats } from '@/types/guest';
export declare class GuestService {
    private guestRepository;
    private weddingRepository;
    constructor();
    submitRSVP(weddingId: string, rsvp: RSVPInput): Promise<import("..").IGuest>;
    getWeddingGuests(weddingId: string, userId: string): Promise<import("..").IGuest[]>;
    getGuestStats(weddingId: string, userId: string): Promise<GuestStats>;
}
//# sourceMappingURL=GuestService.d.ts.map