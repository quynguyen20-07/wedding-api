"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wish = void 0;
const mongoose_1 = require("mongoose");
const WishSchema = new mongoose_1.Schema({
    weddingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true,
    },
    guestName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
WishSchema.index({ weddingId: 1 });
WishSchema.index({ isApproved: 1 });
exports.Wish = (0, mongoose_1.model)('Wish', WishSchema);
//# sourceMappingURL=Wish.js.map