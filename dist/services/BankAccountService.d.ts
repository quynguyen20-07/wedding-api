import { IBankAccount } from "../models/BankAccount";
export interface BankAccountInput {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch?: string;
    qrCodeUrl?: string;
}
export declare class BankAccountService {
    private weddingRepository;
    constructor();
    addBankAccount(weddingId: string, userId: string, data: BankAccountInput): Promise<IBankAccount>;
    getWeddingBankAccounts(weddingId: string, userId: string): Promise<IBankAccount[]>;
    updateBankAccount(id: string, userId: string, data: Partial<BankAccountInput>): Promise<IBankAccount | null>;
    deleteBankAccount(id: string, userId: string): Promise<IBankAccount | null>;
    generateQRCodeData(account: IBankAccount): Promise<string>;
}
//# sourceMappingURL=BankAccountService.d.ts.map