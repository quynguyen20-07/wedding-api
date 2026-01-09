"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const BankAccount_1 = require("../models/BankAccount");
const AppError_1 = require("../utils/AppError");
class BankAccountService {
    constructor() {
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
    }
    async addBankAccount(weddingId, userId, data) {
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const bankAccount = await BankAccount_1.BankAccount.create({
            weddingId: new mongoose_1.Types.ObjectId(weddingId),
            ...data,
        });
        return bankAccount;
    }
    async getWeddingBankAccounts(weddingId, userId) {
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const bankAccounts = await BankAccount_1.BankAccount.find({
            weddingId,
            isActive: true,
        });
        return bankAccounts;
    }
    async updateBankAccount(id, userId, data) {
        const bankAccount = await BankAccount_1.BankAccount.findById(id);
        if (!bankAccount) {
            throw new AppError_1.AppError("Bank account not found", http_status_1.default.NOT_FOUND);
        }
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(bankAccount.weddingId.toString());
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const updatedBankAccount = await BankAccount_1.BankAccount.findByIdAndUpdate(id, { $set: data }, { new: true });
        return updatedBankAccount;
    }
    async deleteBankAccount(id, userId) {
        const bankAccount = await BankAccount_1.BankAccount.findById(id);
        if (!bankAccount) {
            throw new AppError_1.AppError("Bank account not found", http_status_1.default.NOT_FOUND);
        }
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(bankAccount.weddingId.toString());
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", http_status_1.default.FORBIDDEN);
        }
        const deletedBankAccount = await BankAccount_1.BankAccount.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return deletedBankAccount;
    }
    async generateQRCodeData(account) {
        const qrData = {
            bank: account.bankName,
            account: account.accountNumber,
            name: account.accountHolder,
            amount: "",
            content: "QUA TANG DAM CUOI",
        };
        return JSON.stringify(qrData);
    }
}
exports.BankAccountService = BankAccountService;
//# sourceMappingURL=BankAccountService.js.map