"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeddingDetailService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const WeddingDetailRepository_1 = require("../repositories/WeddingDetailRepository");
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const WeddingDetail_1 = require("../models/WeddingDetail");
const AppError_1 = require("../utils/AppError");
class WeddingDetailService {
    constructor() {
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
        this.weddingDetailRepository = new WeddingDetailRepository_1.WeddingDetailRepository();
    }
    // ======================
    // AUTHORIZATION
    // ======================
    async assertCanAccessWedding(weddingId, user) {
        if (user.role === "admin")
            return;
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding) {
            throw new AppError_1.AppError("Wedding not found", http_status_1.default.NOT_FOUND);
        }
        if (wedding.userId.toString() !== user._id.toString()) {
            throw new AppError_1.AppError("Forbidden", http_status_1.default.FORBIDDEN);
        }
    }
    // ======================
    // GET
    // ======================
    async getWeddingDetail(weddingId, user) {
        if (user) {
            await this.assertCanAccessWedding(weddingId, user);
        }
        const weddingDetail = await WeddingDetail_1.WeddingDetail.findOne({ weddingId });
        if (!weddingDetail) {
            throw new AppError_1.AppError("Wedding detail not found", http_status_1.default.NOT_FOUND);
        }
        return weddingDetail;
    }
    // ======================
    // UPDATE BRIDE
    // ======================
    async updateBride(weddingId, user, brideData) {
        await this.assertCanAccessWedding(weddingId, user);
        return WeddingDetail_1.WeddingDetail.findOneAndUpdate({ weddingId }, { $set: { bride: brideData } }, { new: true, upsert: true });
    }
    // ======================
    // UPDATE GROOM
    // ======================
    async updateGroom(weddingId, user, groomData) {
        await this.assertCanAccessWedding(weddingId, user);
        return WeddingDetail_1.WeddingDetail.findOneAndUpdate({ weddingId }, { $set: { groom: groomData } }, { new: true, upsert: true });
    }
    // ======================
    // LOVE STORY
    // ======================
    async addLoveStory(weddingId, user, storyData) {
        await this.assertCanAccessWedding(weddingId, user);
        return WeddingDetail_1.WeddingDetail.findOneAndUpdate({ weddingId }, { $push: { loveStories: storyData } }, { new: true, upsert: true });
    }
    // ======================
    // UPDATE LOVE STORY BY ID
    // ======================
    async updateLoveStory(weddingId, user, storyId, storyData) {
        await this.assertCanAccessWedding(weddingId, user);
        const weddingDetail = await WeddingDetail_1.WeddingDetail.findOneAndUpdate({
            weddingId,
            "loveStories._id": storyId,
        }, {
            $set: {
                "loveStories.$": {
                    _id: storyId,
                    ...storyData,
                },
            },
        }, { new: true });
        if (!weddingDetail) {
            throw new AppError_1.AppError("Love story not found", http_status_1.default.NOT_FOUND);
        }
        return weddingDetail;
    }
    // ======================
    // ADD EVENT
    // ======================
    async addWeddingEvent(weddingId, user, eventData) {
        await this.assertCanAccessWedding(weddingId, user);
        const weddingDetail = await this.weddingDetailRepository.addEvent(weddingId, eventData);
        if (!weddingDetail) {
            throw new AppError_1.AppError("Wedding detail not found", http_status_1.default.NOT_FOUND);
        }
        return weddingDetail;
    }
    // ======================
    // UPDATE EVENT
    // ======================
    async updateWeddingEvent(weddingId, eventId, user, data) {
        await this.assertCanAccessWedding(weddingId, user);
        const event = await this.weddingDetailRepository.findEventById(weddingId, eventId);
        if (!event) {
            throw new AppError_1.AppError("Wedding event not found", http_status_1.default.NOT_FOUND);
        }
        await this.weddingDetailRepository.updateEvent(weddingId, eventId, data);
        return true;
    }
    async deleteWeddingEvent(weddingId, eventId, user) {
        await this.assertCanAccessWedding(weddingId, user);
        const event = await this.weddingDetailRepository.findEventById(weddingId, eventId);
        if (!event) {
            throw new AppError_1.AppError("Wedding event not found", http_status_1.default.NOT_FOUND);
        }
        const weddingDetail = await this.weddingDetailRepository.deleteEvent(weddingId, eventId);
        if (!weddingDetail) {
            throw new AppError_1.AppError("Wedding detail not found", http_status_1.default.NOT_FOUND);
        }
        return weddingDetail;
    }
}
exports.WeddingDetailService = WeddingDetailService;
//# sourceMappingURL=WeddingDetailService.js.map