"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
class BaseModel {
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
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
    async findAll(filter = {}) {
        return this.model.find({ ...filter, isActive: true });
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map