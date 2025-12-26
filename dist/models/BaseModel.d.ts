import { Model, Document } from 'mongoose';
export interface IBaseModel extends Document {
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
export declare abstract class BaseModel<T extends IBaseModel> {
    protected model: Model<T>;
    constructor(model: Model<T>);
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    findAll(filter?: object): Promise<T[]>;
}
//# sourceMappingURL=BaseModel.d.ts.map