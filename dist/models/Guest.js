"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guest = void 0;
const mongoose_1 = require("mongoose");
const GuestSchema = new mongoose_1.Schema({
    weddingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    relationship: String,
    numberOfGuests: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
    },
    attendanceStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'declined'],
        default: 'pending',
    },
    dietaryRestrictions: String,
    message: String,
    respondedAt: Date,
    tableNumber: String,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
GuestSchema.index({ weddingId: 1 });
GuestSchema.index({ email: 1 });
GuestSchema.index({ attendanceStatus: 1 });
exports.Guest = (0, mongoose_1.model)('Guest', GuestSchema);
//# sourceMappingURL=Guest.js.map