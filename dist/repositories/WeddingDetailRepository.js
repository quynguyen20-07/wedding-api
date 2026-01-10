"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeddingDetailRepository = void 0;
const mongoose_1 = require("mongoose");
const WeddingDetail_1 = require("../models/WeddingDetail");
const BaseRepository_1 = require("./BaseRepository");
class WeddingDetailRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(WeddingDetail_1.WeddingDetail);
    }
    async findByWeddingId(weddingId) {
        return this.model.findOne({ weddingId });
    }
    async addEvent(weddingId, eventData) {
        return this.model.findOneAndUpdate({ weddingId }, { $push: { weddingEvents: eventData } }, { new: true, upsert: true });
    }
    async findEventById(weddingId, eventId) {
        return this.model.findOne({
            weddingId,
            "weddingEvents._id": new mongoose_1.Types.ObjectId(eventId),
        }, {
            "weddingEvents.$": 1,
        });
    }
    async updateEvent(weddingId, eventId, updateData) {
        const setData = Object.fromEntries(Object.entries(updateData).map(([key, value]) => [
            `weddingEvents.$.${key}`,
            value,
        ]));
        return this.model.updateOne({
            weddingId,
            "weddingEvents._id": eventId,
        }, {
            $set: setData,
        });
    }
    async deleteEvent(weddingId, eventId) {
        await this.model.updateOne({ weddingId }, { $pull: { weddingEvents: { _id: new mongoose_1.Types.ObjectId(eventId) } } });
        return this.findByWeddingId(weddingId);
    }
}
exports.WeddingDetailRepository = WeddingDetailRepository;
//# sourceMappingURL=WeddingDetailRepository.js.map