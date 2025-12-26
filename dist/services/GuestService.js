"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestService = void 0;
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const GuestRepository_1 = require("../repositories/GuestRepository");
const AppError_1 = require("../utils/AppError");
class GuestService {
    guestRepository;
    weddingRepository;
    constructor() {
        this.guestRepository = new GuestRepository_1.GuestRepository();
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
    }
    async submitRSVP(weddingId, rsvp) {
        // Check if wedding exists and is published
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.status !== "published") {
            throw new AppError_1.AppError("Wedding not found", 404);
        }
        const guest = await this.guestRepository.create({
            weddingId: weddingId,
            ...rsvp,
            respondedAt: new Date(),
        });
        return guest;
    }
    async getWeddingGuests(weddingId, userId) {
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        return this.guestRepository.findByWeddingId(weddingId);
    }
    async getGuestStats(weddingId, userId) {
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        const guests = await this.guestRepository.findByWeddingId(weddingId);
        const stats = {
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
exports.GuestService = GuestService;
//# sourceMappingURL=GuestService.js.map