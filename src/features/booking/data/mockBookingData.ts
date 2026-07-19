/**
 * @file        mockBookingData.ts
 * @feature     Booking
 * @description Static booking history and availability helpers for offline/dev use.
 * @data        MOCK_BOOKINGS, getUnavailableRanges, generateBookingId
 * @author      MiStarStudio
 */

import { addDays, format } from 'date-fns';

import { getMockAvailability } from '../../equipment/data/mockEquipmentData';
import { BookingStatus, PaymentStatus } from '../types/booking.types';
import type { Booking } from '../types/booking.types';

const fmt = (d: Date) => format(d, 'yyyy-MM-dd');
const today = new Date();

// TODO(api): replace with GET /bookings — remove static seed data
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    equipmentId: 'eq-001',
    equipmentName: 'Massey Ferguson 375',
    equipmentImage: 'https://picsum.photos/seed/agrorent-mf375/800/600',
    farmerId: 'farmer-1',
    farmerName: 'Demo User',
    ownerId: 'owner-1',
    ownerName: 'Kwame Asante',
    startDate: fmt(addDays(today, 5)),
    endDate: fmt(addDays(today, 8)),
    totalDays: 4,
    totalCost: 720,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    createdAt: fmt(addDays(today, -1)),
  },
  {
    id: 'bk-002',
    equipmentId: 'eq-002',
    equipmentName: 'John Deere 5075E',
    equipmentImage: 'https://picsum.photos/seed/agrorent-jd5075/800/600',
    farmerId: 'farmer-1',
    farmerName: 'Demo User',
    ownerId: 'owner-2',
    ownerName: 'Ama Osei',
    startDate: fmt(addDays(today, 14)),
    endDate: fmt(addDays(today, 16)),
    totalDays: 3,
    totalCost: 660,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: fmt(addDays(today, -3)),
  },
  {
    id: 'bk-003',
    equipmentId: 'eq-005',
    equipmentName: 'Solar Drip Irrigation Kit',
    equipmentImage: 'https://picsum.photos/seed/agrorent-drip-irrigation/800/600',
    farmerId: 'farmer-2',
    farmerName: 'Akosua Boateng',
    ownerId: 'owner-4',
    ownerName: 'Yaw Boateng',
    startDate: fmt(addDays(today, -10)),
    endDate: fmt(addDays(today, -7)),
    totalDays: 4,
    totalCost: 380,
    status: BookingStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: fmt(addDays(today, -20)),
  },
  {
    id: 'bk-004',
    equipmentId: 'eq-003',
    equipmentName: 'Kubota DC-70 Combine',
    equipmentImage: 'https://picsum.photos/seed/agrorent-kubota-combine/800/600',
    farmerId: 'farmer-1',
    farmerName: 'Demo User',
    ownerId: 'owner-3',
    ownerName: 'Kofi Mensah',
    startDate: fmt(addDays(today, -5)),
    endDate: fmt(addDays(today, -3)),
    totalDays: 3,
    totalCost: 1350,
    status: BookingStatus.CANCELLED,
    paymentStatus: PaymentStatus.REFUNDED,
    createdAt: fmt(addDays(today, -15)),
  },
];

/** Delegates to equipment availability mock — same blocked ranges apply to booking calendar. */
export function getUnavailableRanges(equipmentId: string) {
  return getMockAvailability(equipmentId);
}

/** Generates a client-side booking id until the API assigns persistent ids. */
export function generateBookingId(): string {
  return `bk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
