"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccount = void 0;
const mongoose_1 = require("mongoose");
const BankAccountSchema = new mongoose_1.Schema({
    weddingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    accountHolder: {
        type: String,
        required: true,
    },
    branch: String,
    qrCodeUrl: String,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.BankAccount = (0, mongoose_1.model)('BankAccount', BankAccountSchema);
//# sourceMappingURL=BankAccount.js.map