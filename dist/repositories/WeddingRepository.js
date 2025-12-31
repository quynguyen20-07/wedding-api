"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeddingRepository = void 0;
const Wedding_1 = require("../models/Wedding");
const BaseRepository_1 = require("./BaseRepository");
class WeddingRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Wedding_1.Wedding);
    }
    async findByUserId(userId) {
        return this.findAll({ userId, isActive: true });
    }
    async findList() {
        return this.findAll();
    }
    async findBySlug(slug) {
        return this.findOne({ slug, isActive: true });
    }
    async incrementViewCount(slug) {
        return this.model.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } }, { new: true });
    }
    async publishWedding(id) {
        return this.update(id, {
            status: "published",
            publishedAt: new Date(),
        });
    }
    async unpublishWedding(id) {
        return this.update(id, { status: "draft" });
    }
    async searchWeddings(query, userId) {
        const filter = {
            $or: [
                { title: { $regex: query, $options: "i" } },
                { slug: { $regex: query, $options: "i" } },
            ],
            isActive: true,
        };
        if (userId) {
            filter.userId = userId;
        }
        return this.model.find(filter);
    }
}
exports.WeddingRepository = WeddingRepository;
//# sourceMappingURL=WeddingRepository.js.map