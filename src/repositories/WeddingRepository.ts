import { IWedding, Wedding } from "../models/Wedding";
import { BaseRepository } from "./BaseRepository";

export class WeddingRepository extends BaseRepository<IWedding> {
  constructor() {
    super(Wedding);
  }

  async findByUserId(userId: string): Promise<IWedding[]> {
    return this.findAll({ userId, isActive: true });
  }

  async findList(): Promise<IWedding[]> {
    return this.findAll();
  }

  async delete(id: string): Promise<IWedding | null> {
    return this.model.findByIdAndDelete(id);
  }

  async findBySlug(slug: string, isActive?: boolean): Promise<IWedding | null> {
    const query: Record<string, unknown> = { slug };

    if (isActive) {
      query.isActive = isActive;
    }

    return this.findOne(query);
  }

  async incrementViewCount(slug: string): Promise<IWedding | null> {
    return this.model.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true },
    );
  }

  async publishWedding(id: string): Promise<IWedding | null> {
    return this.update(id, {
      status: "published",
      publishedAt: new Date(),
    });
  }

  async unpublishWedding(id: string): Promise<IWedding | null> {
    return this.update(id, { status: "draft" });
  }

  async searchWeddings(query: string, userId?: string): Promise<IWedding[]> {
    const filter: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ],
      isActive: true,
    };

    if (userId) {
      filter.userId = userId;
    }

    return this.model.find(filter);
  }
}
