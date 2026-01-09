"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeddingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const WeddingDetail_1 = require("../models/WeddingDetail");
const helpers_1 = require("../utils/helpers");
const AppError_1 = require("../utils/AppError");
class WeddingService {
    constructor() {
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
    }
    async createWedding(user, data) {
        const slug = data.slug || (0, helpers_1.generateSlug)(data.title);
        // Check if slug exists
        const existing = await this.weddingRepository.findBySlug(slug);
        if (existing) {
            throw new AppError_1.AppError("Slug already exists", 400);
        }
        // Default theme settings
        const themeSettings = {
            primaryColor: data.themeSettings?.primaryColor || "#F7E7CE",
            secondaryColor: data.themeSettings?.secondaryColor || "#F4B6C2",
            fontHeading: data.themeSettings?.fontHeading || "Playfair Display",
            fontBody: data.themeSettings?.fontBody || "Inter",
            backgroundMusic: data.themeSettings?.backgroundMusic,
        };
        // Default bride info
        const defaultBride = {
            fullName: data.bride?.fullName || "Cô Dâu",
            avatar: data.bride?.avatar || "/default-avatar-bride.png",
            shortBio: data.bride?.shortBio || "Hạnh phúc là được ở bên người mình yêu",
            familyInfo: data.bride?.familyInfo,
            socialLinks: data.bride?.socialLinks || {},
        };
        // Default groom info
        const defaultGroom = {
            fullName: data.groom?.fullName || "Chú Rể",
            avatar: data.groom?.avatar || "/default-avatar-groom.png",
            shortBio: data.groom?.shortBio || "Yêu là khi tìm thấy nửa còn lại của mình",
            familyInfo: data.groom?.familyInfo,
            socialLinks: data.groom?.socialLinks || {},
        };
        // Create wedding
        const wedding = await this.weddingRepository.create({
            userId: new mongoose_1.Types.ObjectId(user?._id.toString()),
            title: data.title,
            slug,
            weddingDate: data.weddingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            language: data.language || "vi",
            themeSettings,
        });
        // Create wedding detail with bride and groom info
        await WeddingDetail_1.WeddingDetail.create({
            weddingId: wedding._id,
            bride: defaultBride,
            groom: defaultGroom,
            loveStories: [],
            weddingEvents: [],
        });
        // Add a default wedding event (ceremony) based on wedding date
        if (data.weddingDate) {
            const weddingDetail = await WeddingDetail_1.WeddingDetail.findOne({
                weddingId: wedding._id,
            });
            if (weddingDetail) {
                const ceremonyEvent = {
                    title: "Lễ Thành Hôn",
                    type: "ceremony",
                    eventDate: data.weddingDate,
                    startTime: "08:00",
                    endTime: "12:00",
                    address: "Nhà thờ / Địa điểm tổ chức",
                    description: "Lễ cưới chính thức của cô dâu và chú rể",
                };
                weddingDetail.weddingEvents.push(ceremonyEvent);
                await weddingDetail.save();
            }
        }
        return wedding;
    }
    async getUserWeddings(user) {
        return this.weddingRepository.findByUserId(user?._id.toString());
    }
    async getWeddings() {
        return this.weddingRepository.findList();
    }
    async getWeddingById(id, user) {
        const wedding = await this.weddingRepository.findById(id);
        if (!wedding || !wedding.isActive) {
            throw new AppError_1.AppError("Wedding not found", http_status_1.default.NOT_FOUND);
        }
        if (user?.role !== "admin" &&
            wedding.userId.toString() !== user?._id.toString()) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        return wedding;
    }
    async getWeddingBySlug(slug, user) {
        let isActive = undefined;
        if (user?.role !== "admin") {
            isActive = true;
        }
        const wedding = await this.weddingRepository.findBySlug(slug, isActive);
        if (!wedding) {
            throw new AppError_1.AppError("Wedding not found", 404);
        }
        await this.weddingRepository.incrementViewCount(slug);
        return wedding;
    }
    async updateWedding(id, user, data) {
        await this.getWeddingById(id, user?._id.toString());
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
    async deleteWedding(id, user) {
        await this.getWeddingById(id, user?._id.toString());
        return this.weddingRepository.delete(id);
    }
    async publishWedding(id, user) {
        await this.getWeddingById(id, user?._id.toString());
        return this.weddingRepository.publishWedding(id);
    }
    async unpublishWedding(id, user) {
        await this.getWeddingById(id, user?._id.toString());
        return this.weddingRepository.unpublishWedding(id);
    }
    async searchWeddings(query, userId) {
        return this.weddingRepository.searchWeddings(query, userId);
    }
}
exports.WeddingService = WeddingService;
//# sourceMappingURL=WeddingService.js.map