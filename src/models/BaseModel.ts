import { Schema, Model, Document } from 'mongoose';


export interface IBaseModel extends Document {
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export abstract class BaseModel<T extends IBaseModel> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async findAll(filter: object = {}): Promise<T[]> {
    return this.model.find({ ...filter, isActive: true });
  }
}