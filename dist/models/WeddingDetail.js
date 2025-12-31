"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeddingDetail = void 0;
const mongoose_1 = require("mongoose");
const BrideGroomSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    avatar: String,
    shortBio: String,
    familyInfo: String,
    socialLinks: { type: Map, of: String },
});
const WeddingEventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ["ceremony", "reception", "party"],
        required: true,
    },
    eventDate: { type: Date, required: true },
    startTime: String,
    endTime: String,
    address: { type: String, required: true },
    locationLat: Number,
    locationLng: Number,
    mapEmbedUrl: String,
    description: String,
});
const LoveStorySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    storyDate: Date,
    imageUrl: String,
});
const WeddingDetailSchema = new mongoose_1.Schema({
    weddingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wedding",
        required: true,
        unique: true,
    },
    bride: BrideGroomSchema,
    groom: BrideGroomSchema,
    loveStories: [LoveStorySchema],
    weddingEvents: [WeddingEventSchema],
}, {
    timestamps: true,
});
exports.WeddingDetail = (0, mongoose_1.model)("WeddingDetail", WeddingDetailSchema);
//# sourceMappingURL=WeddingDetail.js.map