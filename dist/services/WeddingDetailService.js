"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeddingDetailService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const WeddingDetail_1 = require("../models/WeddingDetail");
const AppError_1 = require("../utils/AppError");
class WeddingDetailService {
    constructor() {
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
    }
    async getWeddingDetail(weddingId, userId) {
        if (userId) {
            // Verify wedding ownership
            const wedding = await this.weddingRepository.findById(weddingId);
            if (!wedding || wedding.userId.toString() !== userId) {
                throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
            }
        }
        const weddingDetail = await WeddingDetail_1.WeddingDetail.findOne({ weddingId });
        if (!weddingDetail) {
            throw new AppError_1.AppError("Wedding detail not found", 404);
        }
        return weddingDetail;
    }
    async updateBride(weddingId, userId, brideData) {
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const weddingDetail = await WeddingDetail_1.WeddingDetail.findOneAndUpdate({ weddingId }, { $set: { bride: brideData } }, { new: true, upsert: true });
        return weddingDetail;
    }
    async updateGroom(weddingId, userId, groomData) {
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const weddingDetail = await WeddingDetail_1.WeddingDetail.findOneAndUpdate({ weddingId }, { $set: { groom: groomData } }, { new: true, upsert: true });
        return weddingDetail;
    }
    async addLoveStory(weddingId, userId, storyData) {
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const weddingDetail = await WeddingDetail_1.WeddingDetail.findOneAndUpdate({ weddingId }, { $push: { loveStories: storyData } }, { new: true, upsert: true });
        return weddingDetail;
    }
    async addWeddingEvent(weddingId, userId, eventData) {
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const weddingDetail = await WeddingDetail_1.WeddingDetail.findOneAndUpdate({ weddingId }, { $push: { weddingEvents: eventData } }, { new: true, upsert: true });
        return weddingDetail;
    }
}
exports.WeddingDetailService = WeddingDetailService;
//# sourceMappingURL=WeddingDetailService.js.map