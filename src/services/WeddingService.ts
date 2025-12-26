import { Types } from "mongoose";

import { WeddingRepository } from "../repositories/WeddingRepository";
import { CreateWeddingData, UpdateWeddingData } from "../types";
import { WeddingDetail } from "../models/WeddingDetail";
import { generateSlug } from "../utils/helpers";
import { IWedding } from "../models/Wedding";
import { AppError } from "../utils/AppError";

export class WeddingService {
  private weddingRepository: WeddingRepository;

  constructor() {
    this.weddingRepository = new WeddingRepository();
  }

  async createWedding(
    userId: string,
    data: CreateWeddingData
  ): Promise<IWedding> {
    const slug = data.slug || generateSlug(data.title);

    const existing = await this.weddingRepository.findBySlug(slug);
    if (existing) {
      throw new AppError("Slug already exists", 400);
    }

    // SỬA: Chuẩn bị data với đầy đủ themeSettings
    const themeSettings = {
      primaryColor: data.themeSettings?.primaryColor || "#F7E7CE",
      secondaryColor: data.themeSettings?.secondaryColor || "#F4B6C2",
      fontHeading: data.themeSettings?.fontHeading || "Playfair Display",
      fontBody: data.themeSettings?.fontBody || "Inter",
      backgroundMusic: data.themeSettings?.backgroundMusic,
    };

    const wedding = await this.weddingRepository.create({
      userId: new Types.ObjectId(userId), // SỬA: Convert string sang ObjectId
      title: data.title,
      slug,
      language: data.language || "vi",
      themeSettings, // Truyền đã đầy đủ
    });

    // Create wedding detail
    await WeddingDetail.create({
      weddingId: wedding._id,
      bride: { fullName: "" },
      groom: { fullName: "" },
      loveStories: [],
      weddingEvents: [],
    });

    return wedding;
  }

  async getUserWeddings(userId: string): Promise<IWedding[]> {
    return this.weddingRepository.findByUserId(userId);
  }

  async getWeddingById(id: string, userId?: string): Promise<IWedding | null> {
    const wedding = await this.weddingRepository.findById(id);

    if (!wedding || !wedding.isActive) {
      throw new AppError("Wedding not found", 404);
    }

    if (userId && wedding.userId.toString() !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    return wedding;
  }

  async getWeddingBySlug(slug: string): Promise<IWedding | null> {
    const wedding = await this.weddingRepository.findBySlug(slug);

    if (!wedding || !wedding.isActive || wedding.status !== "published") {
      throw new AppError("Wedding not found", 404);
    }

    await this.weddingRepository.incrementViewCount(slug);

    return wedding;
  }

  async updateWedding(
    id: string,
    userId: string,
    data: UpdateWeddingData
  ): Promise<IWedding | null> {
    await this.getWeddingById(id, userId);

    // SỬA: Chỉ update những field được cung cấp
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.slug) updateData.slug = data.slug;
    if (data.language) updateData.language = data.language;
    if (data.status) updateData.status = data.status;
    if (data.themeSettings) {
      updateData.themeSettings = {
        primaryColor: data.themeSettings.primaryColor,
        secondaryColor: data.themeSettings.secondaryColor,
        fontHeading: data.themeSettings.fontHeading,
        fontBody: data.themeSettings.fontBody,
        backgroundMusic: data.themeSettings.backgroundMusic,
      };
    }

    return this.weddingRepository.update(id, updateData);
  }

  async deleteWedding(id: string, userId: string): Promise<IWedding | null> {
    await this.getWeddingById(id, userId);
    return this.weddingRepository.delete(id);
  }

  async publishWedding(id: string, userId: string): Promise<IWedding | null> {
    await this.getWeddingById(id, userId);
    return this.weddingRepository.publishWedding(id);
  }

  async unpublishWedding(id: string, userId: string): Promise<IWedding | null> {
    await this.getWeddingById(id, userId);
    return this.weddingRepository.unpublishWedding(id);
  }

  async searchWeddings(query: string, userId?: string): Promise<IWedding[]> {
    return this.weddingRepository.searchWeddings(query, userId);
  }
}
