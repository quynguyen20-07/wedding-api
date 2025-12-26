"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Guest_1 = require("../models/Guest");
class GuestRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Guest_1.Guest);
    }
    async findByWeddingId(weddingId) {
        return this.findAll({ weddingId, isActive: true });
    }
    async findByEmail(email) {
        return this.findOne({ email, isActive: true });
    }
    async updateAttendanceStatus(id, status) {
        return this.update(id, {
            attendanceStatus: status,
            respondedAt: new Date(),
        });
    }
}
exports.GuestRepository = GuestRepository;
//# sourceMappingURL=GuestRepository.js.map