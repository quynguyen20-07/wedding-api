"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeddingService = void 0;
const mongoose_1 = require("mongoose");
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const WeddingDetail_1 = require("../models/WeddingDetail");
const helpers_1 = require("../utils/helpers");
const AppError_1 = require("../utils/AppError");
class WeddingService {
    weddingRepository;
    constructor() {
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
    }
    async createWedding(userId, data) {
        const slug = data.slug || (0, helpers_1.generateSlug)(data.title);
        const existing = await this.weddingRepository.findBySlug(slug);
        if (existing) {
            throw new AppError_1.AppError("Slug already exists", 400);
        }
        // SỬA: Chuẩn bị data với đầy đủ themeSettings
        const themeSettings = {
            primaryColor: data.themeSettings?.primaryColor || "#F7E7CE",
            secondaryColor: data.themeSettings?.secondaryColor || "#F4B6C2",
            fontHeading: data.themeSettings?.fontHeading || "Playfair Display",
            fontBody: data.themeSettings?.fontBody || "Inter",
            backgroundMusic: data.themeSettings?.backgroundMusic,
        };
        const wedding = await this.weddingRepository.create({
            userId: new mongoose_1.Types.ObjectId(userId), // SỬA: Convert string sang ObjectId
            title: data.title,
            slug,
            language: data.language || "vi",
            themeSettings, // Truyền đã đầy đủ
        });
        // Create wedding detail
        await WeddingDetail_1.WeddingDetail.create({
            weddingId: wedding._id,
            bride: { fullName: "" },
            groom: { fullName: "" },
            loveStories: [],
            weddingEvents: [],
        });
        return wedding;
    }
    async getUserWeddings(userId) {
        return this.weddingRepository.findByUserId(userId);
    }
    async getWeddingById(id, userId) {
        const wedding = await this.weddingRepository.findById(id);
        if (!wedding || !wedding.isActive) {
            throw new AppError_1.AppError("Wedding not found", 404);
        }
        if (userId && wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        return wedding;
    }
    async getWeddingBySlug(slug) {
        const wedding = await this.weddingRepository.findBySlug(slug);
        if (!wedding || !wedding.isActive || wedding.status !== "published") {
            throw new AppError_1.AppError("Wedding not found", 404);
        }
        await this.weddingRepository.incrementViewCount(slug);
        return wedding;
    }
    async updateWedding(id, userId, data) {
        await this.getWeddingById(id, userId);
        // SỬA: Chỉ update những field được cung cấp
        const updateData = {};
        if (data.title)
            updateData.title = data.title;
        if (data.slug)
            updateData.slug = data.slug;
        if (data.language)
            updateData.language = data.language;
        if (data.status)
            updateData.status = data.status;
        if (data.themeSettings) {
            updateData.themeSettings = {
                primaryColor: data.themeSettings.primaryColor,
                secondaryColor: data.themeSettings.secondaryColor,
                fontHeading: data.themeSettings.fontHeading,
                fontBody: data.themeSettings.fontBody,
                backgroundMusic: data.themeSettings.backgroundMusic,
            };
        }
        return this.weddingRepository.update(id, updateData);
    }
    async deleteWedding(id, userId) {
        await this.getWeddingById(id, userId);
        return this.weddingRepository.delete(id);
    }
    async publishWedding(id, userId) {
        await this.getWeddingById(id, userId);
        return this.weddingRepository.publishWedding(id);
    }
    async unpublishWedding(id, userId) {
        await this.getWeddingById(id, userId);
        return this.weddingRepository.unpublishWedding(id);
    }
    async searchWeddings(query, userId) {
        return this.weddingRepository.searchWeddings(query, userId);
    }
}
exports.WeddingService = WeddingService;
//# sourceMappingURL=WeddingService.js.map