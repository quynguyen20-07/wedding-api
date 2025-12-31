"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wedding = void 0;
const mongoose_1 = require("mongoose");
const WeddingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    weddingDate: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
    },
    language: {
        type: String,
        enum: ["vi", "en"],
        default: "vi",
    },
    themeSettings: {
        primaryColor: {
            type: String,
            default: "#F7E7CE",
        },
        secondaryColor: {
            type: String,
            default: "#F4B6C2",
        },
        fontHeading: {
            type: String,
            default: "Playfair Display",
        },
        fontBody: {
            type: String,
            default: "Inter",
        },
        backgroundMusic: String,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    publishedAt: Date,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
WeddingSchema.index({ userId: 1 });
WeddingSchema.index({ slug: 1 });
WeddingSchema.index({ status: 1 });
exports.Wedding = (0, mongoose_1.model)("Wedding", WeddingSchema);
//# sourceMappingURL=Wedding.js.map