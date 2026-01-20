import HttpStatus from "http-status";
import { Types } from "mongoose";

import { WeddingRepository } from "../repositories/WeddingRepository";
import { CreateWeddingData, UpdateWeddingData } from "../types";
import { WeddingDetail } from "../models/WeddingDetail";
import { generateSlug } from "../utils/helpers";
import { IWedding } from "../models/Wedding";
import { AppError } from "../utils/AppError";
import { IUser } from "../models/User";
import logger from "../utils/logger";

export class WeddingService {
  private weddingRepository: WeddingRepository;

  constructor() {
    this.weddingRepository = new WeddingRepository();
  }

  async createWedding(user: IUser, data: CreateWeddingData): Promise<IWedding> {
    const slug = data.slug || generateSlug(data.title);

    // Check if slug exists
    const existing = await this.weddingRepository.findBySlug(slug);
    if (existing) {
      throw new AppError("Slug already exists", 400);
    }

    // Default theme settings
    const themeSettings = {
      primaryColor: data.themeSettings?.primaryColor || "#F7E7CE",
      secondaryColor: data.themeSettings?.secondaryColor || "#F4B6C2",
      fontHeading: data.themeSettings?.fontHeading || "Playfair Display",
      fontBody: data.themeSettings?.fontBody || "Inter",
      template: data.themeSettings?.template || "blush-romance",
      backgroundMusic: data.themeSettings?.backgroundMusic,
    };

    // Default bride info
    const defaultBride = {
      fullName: data.bride?.fullName || "Cô Dâu",
      avatar: data.bride?.avatar || "/default-avatar-bride.png",
      shortBio:
        data.bride?.shortBio || "Hạnh phúc là được ở bên người mình yêu",
      familyInfo: data.bride?.familyInfo,
      socialLinks: data.bride?.socialLinks || {},
    };

    // Default groom info
    const defaultGroom = {
      fullName: data.groom?.fullName || "Chú Rể",
      avatar: data.groom?.avatar || "/default-avatar-groom.png",
      shortBio:
        data.groom?.shortBio || "Yêu là khi tìm thấy nửa còn lại của mình",
      familyInfo: data.groom?.familyInfo,
      socialLinks: data.groom?.socialLinks || {},
    };

    // Create wedding
    const wedding = await this.weddingRepository.create({
      userId: new Types.ObjectId(user?._id.toString()),
      title: data.title,
      slug,
      weddingDate:
        data.weddingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      language: data.language || "vi",
      themeSettings,
    });

    // Create wedding detail with bride and groom info
    await WeddingDetail.create({
      weddingId: wedding._id,
      bride: defaultBride,
      groom: defaultGroom,
      loveStories: [],
      weddingEvents: [],
    });

    // Add a default wedding event (ceremony) based on wedding date
    if (data.weddingDate) {
      const weddingDetail = await WeddingDetail.findOne({
        weddingId: wedding._id,
      });
      if (weddingDetail) {
        const ceremonyEvent = {
          title: "Lễ Thành Hôn",
          type: "ceremony" as const,
          eventDate: data.weddingDate,
          startTime: "08:00",
          endTime: "12:00",
          address: "Nhà thờ / Địa điểm tổ chức",
          description: "Lễ cưới chính thức của cô dâu và chú rể",
        };

        weddingDetail.weddingEvents.push(ceremonyEvent);
        await weddingDetail.save();
      }
    }

    return wedding;
  }

  async getUserWeddings(user?: IUser): Promise<IWedding[]> {
    return this.weddingRepository.findByUserId(user?._id.toString());
  }

  async getWeddings(): Promise<IWedding[]> {
    return this.weddingRepository.findList();
  }

  async getWeddingById(id: string, user?: IUser): Promise<IWedding | null> {
    const wedding = await this.weddingRepository.findById(id);

    if (!wedding || !wedding.isActive) {
      throw new AppError("Wedding not found", HttpStatus.NOT_FOUND);
    }

    if (
      user?.role !== "admin" &&
      wedding.userId.toString() !== user?._id.toString()
    ) {
      throw new AppError("Unauthorized", HttpStatus.FORBIDDEN);
    }

    return wedding;
  }

  async getWeddingBySlug(
    slug: string,
    user?: IUser | null,
  ): Promise<IWedding | null> {
    let isActive: boolean | undefined = undefined;
    if (user?.role !== "admin") {
      isActive = true;
    }

    const wedding = await this.weddingRepository.findBySlug(slug, isActive);

    if (!wedding) {
      throw new AppError("Wedding not found", 404);
    }

    await this.weddingRepository.incrementViewCount(slug);

    return wedding;
  }

  async updateWedding(
    id: string,
    data: UpdateWeddingData,
  ): Promise<IWedding | null> {
    const wedding = await this.weddingRepository.findById(id);
    if (!wedding) {
      throw new AppError("Đám cưới không tồn tại", HttpStatus.BAD_REQUEST);
    }

    logger.info("wedding", {
      wedding,
    });

    const updateData: Partial<IWedding> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.status !== undefined) updateData.status = data.status;

    if (data.themeSettings) {
      updateData.themeSettings = {
        ...wedding.themeSettings,
        ...data.themeSettings,
      };
    }

    return this.weddingRepository.update(id, updateData);
  }

  async deleteWedding(id: string, user?: IUser): Promise<IWedding | null> {
    await this.getWeddingById(id, user);
    return this.weddingRepository.delete(id);
  }

  async publishWedding(id: string, user?: IUser): Promise<IWedding | null> {
    await this.getWeddingById(id, user);
    return this.weddingRepository.publishWedding(id);
  }

  async unpublishWedding(id: string, user?: IUser): Promise<IWedding | null> {
    await this.getWeddingById(id, user?._id.toString());
    return this.weddingRepository.unpublishWedding(id);
  }

  async searchWeddings(query: string, userId?: string): Promise<IWedding[]> {
    return this.weddingRepository.searchWeddings(query, userId);
  }
}
