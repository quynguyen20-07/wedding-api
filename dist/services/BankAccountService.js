"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountService = void 0;
const mongoose_1 = require("mongoose");
const WeddingRepository_1 = require("../repositories/WeddingRepository");
const BankAccount_1 = require("../models/BankAccount");
const AppError_1 = require("../utils/AppError");
class BankAccountService {
    weddingRepository;
    constructor() {
        this.weddingRepository = new WeddingRepository_1.WeddingRepository();
    }
    async addBankAccount(weddingId, userId, data) {
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(weddingId);
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
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
            throw new AppError_1.AppError("Unauthorized", 403);
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
            throw new AppError_1.AppError("Bank account not found", 404);
        }
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(bankAccount.weddingId.toString());
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        const updatedBankAccount = await BankAccount_1.BankAccount.findByIdAndUpdate(id, { $set: data }, { new: true });
        return updatedBankAccount;
    }
    async deleteBankAccount(id, userId) {
        const bankAccount = await BankAccount_1.BankAccount.findById(id);
        if (!bankAccount) {
            throw new AppError_1.AppError("Bank account not found", 404);
        }
        // Verify wedding ownership
        const wedding = await this.weddingRepository.findById(bankAccount.weddingId.toString());
        if (!wedding || wedding.userId.toString() !== userId) {
            throw new AppError_1.AppError("Unauthorized", 403);
        }
        const deletedBankAccount = await BankAccount_1.BankAccount.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return deletedBankAccount;
    }
    async generateQRCodeData(account) {
        // Generate QR code data for Vietnam bank transfer
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