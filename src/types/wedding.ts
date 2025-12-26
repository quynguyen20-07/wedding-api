// src/types/wedding.ts - THÊM TYPE CHO CREATION
import { Types } from 'mongoose';


export type WeddingStatus = 'draft' | 'published' | 'archived';
export type WeddingLanguage = 'vi' | 'en';
export type EventType = 'ceremony' | 'reception' | 'party';

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontHeading: string;
  fontBody: string;
  backgroundMusic?: string;
}

export interface BrideGroomInfo {
  fullName: string;
  avatar?: string;
  shortBio?: string;
  familyInfo?: string;
  socialLinks?: Record<string, string>;
}

export interface WeddingEvent {
  title: string;
  type: EventType;
  eventDate: Date;
  startTime?: string;
  endTime?: string;
  address: string;
  locationLat?: number;
  locationLng?: number;
  mapEmbedUrl?: string;
  description?: string;
}

export interface LoveStory {
  title: string;
  content: string;
  storyDate?: Date;
  imageUrl?: string;
}

export interface Wedding {
  id: string;
  userId: Types.ObjectId; // SỬA THÀNH ObjectId
  slug: string;
  title: string;
  status: WeddingStatus;
  language: WeddingLanguage;
  themeSettings: ThemeSettings;
  viewCount: number;
  publishedAt?: Date;
  bride?: BrideGroomInfo;
  groom?: BrideGroomInfo;
  loveStories?: LoveStory[];
  weddingEvents?: WeddingEvent[];
  isActive: boolean;
}

// THÊM TYPE CHO CREATION INPUT
export interface CreateWeddingData {
  title: string;
  slug?: string;
  language?: WeddingLanguage;
  themeSettings?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontHeading?: string;
    fontBody?: string;
    backgroundMusic?: string;
  };
}

export interface UpdateWeddingData {
  title?: string;
  slug?: string;
  language?: WeddingLanguage;
  status?: WeddingStatus;
  themeSettings?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontHeading?: string;
    fontBody?: string;
    backgroundMusic?: string;
  };
}