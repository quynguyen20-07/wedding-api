import { IWedding, Wedding } from "../models/Wedding";
import { BaseRepository } from "./BaseRepository";

export class WeddingRepository extends BaseRepository<IWedding> {
  constructor() {
    super(Wedding);
  }

  async findByUserId(userId: string): Promise<IWedding[]> {
    return this.findAll({ userId, isActive: true });
  }

  async findBySlug(slug: string): Promise<IWedding | null> {
    return this.findOne({ slug, isActive: true });
  }

  async incrementViewCount(slug: string): Promise<IWedding | null> {
    return this.model.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true }
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
