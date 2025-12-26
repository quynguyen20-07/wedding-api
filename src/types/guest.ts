export type AttendanceStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  weddingId: string;
  fullName: string;
  email?: string;
  phone?: string;
  relationship?: string;
  numberOfGuests: number;
  attendanceStatus: AttendanceStatus;
  dietaryRestrictions?: string;
  message?: string;
  respondedAt?: Date;
  tableNumber?: string;
  isActive: boolean;
}

export interface GuestStats {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  totalGuests: number;
}

export interface RSVPInput {
  fullName: string;
  email?: string;
  phone?: string;
  numberOfGuests: number;
  attendanceStatus: AttendanceStatus;
  dietaryRestrictions?: string;
  message?: string;
}