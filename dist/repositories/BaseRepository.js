"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async findOne(filter) {
        return this.model.findOne(filter);
    }
    async findAll(filter = {}) {
        return this.model.find(filter);
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
    async count(filter = {}) {
        return this.model.countDocuments(filter);
    }
    async exists(filter) {
        const count = await this.count(filter);
        return count > 0;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map