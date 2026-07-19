/**
 * @file        booking.types.ts
 * @feature     Booking
 * @description Domain types for equipment rental bookings, drafts, and availability ranges.
 * @data        BookingStatus, PaymentStatus, Booking, BookingDraft, UnavailableDateRange
 * @author      MiStarStudio
 */

/** Lifecycle states for a rental booking from request through completion or cancellation. */
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

/** Payment settlement state mirrored on each booking record. */
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

/** Persisted rental booking linking farmer, owner, equipment, and payment. */
export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  farmerId: string;
  farmerName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCost: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  rejectReason?: string;
  createdAt: string;
}

/** In-progress booking assembled before payment and final submission. */
export interface BookingDraft {
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  ownerId: string;
  ownerName: string;
  dailyRate: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalCost: number;
  notes?: string;
  /** Set after MoMo payment succeeds in the draft booking flow. */
  paymentCompleted?: boolean;
}

/** Inclusive date range when equipment is unavailable for new bookings. */
export interface UnavailableDateRange {
  startDate: string;
  endDate: string;
}
