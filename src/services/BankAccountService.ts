import { Types } from "mongoose";

import { WeddingRepository } from "../repositories/WeddingRepository";
import { IBankAccount, BankAccount } from "../models/BankAccount";
import { AppError } from "../utils/AppError";

export interface BankAccountInput {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  qrCodeUrl?: string;
}

export class BankAccountService {
  private weddingRepository: WeddingRepository;

  constructor() {
    this.weddingRepository = new WeddingRepository();
  }

  async addBankAccount(
    weddingId: string,
    userId: string,
    data: BankAccountInput
  ): Promise<IBankAccount> {
    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const bankAccount = await BankAccount.create({
      weddingId: new Types.ObjectId(weddingId),
      ...data,
    });

    return bankAccount;
  }

  async getWeddingBankAccounts(
    weddingId: string,
    userId: string
  ): Promise<IBankAccount[]> {
    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(weddingId);
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const bankAccounts = await BankAccount.find({
      weddingId,
      isActive: true,
    });

    return bankAccounts;
  }

  async updateBankAccount(
    id: string,
    userId: string,
    data: Partial<BankAccountInput>
  ): Promise<IBankAccount | null> {
    const bankAccount = await BankAccount.findById(id);
    if (!bankAccount) {
      throw new AppError("Bank account not found", 404);
    }

    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(
      bankAccount.weddingId.toString()
    );
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const updatedBankAccount = await BankAccount.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return updatedBankAccount;
  }

  async deleteBankAccount(
    id: string,
    userId: string
  ): Promise<IBankAccount | null> {
    const bankAccount = await BankAccount.findById(id);
    if (!bankAccount) {
      throw new AppError("Bank account not found", 404);
    }

    // Verify wedding ownership
    const wedding = await this.weddingRepository.findById(
      bankAccount.weddingId.toString()
    );
    if (!wedding || wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    const deletedBankAccount = await BankAccount.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return deletedBankAccount;
  }

  async generateQRCodeData(account: IBankAccount): Promise<string> {
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
