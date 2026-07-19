/**
 * @file        BookingStatusBadge.tsx
 * @feature     Booking
 * @description Color-coded badge for booking lifecycle and payment settlement states.
 * @data        BookingStatus, PaymentStatus, BOOKING_STATUS_COLOR_MAP
 * @consumes    Badge
 * @author      MiStarStudio
 */

import { Badge, DEFAULT_STATUS_COLOR_MAP } from '../../../components';
import { BookingStatus } from '../types/booking.types';
import { PaymentStatus } from '../types/booking.types';

/** Tailwind class map extending shared defaults with booking-specific palette. */
export const BOOKING_STATUS_COLOR_MAP: Record<string, string> = {
  ...DEFAULT_STATUS_COLOR_MAP,
  [BookingStatus.PENDING]: 'bg-amber-100 text-amber-800',
  [BookingStatus.CONFIRMED]: 'bg-green-100 text-primary',
  [BookingStatus.ACTIVE]: 'bg-blue-100 text-secondary',
  [BookingStatus.COMPLETED]: 'bg-green-100 text-success',
  [BookingStatus.CANCELLED]: 'bg-red-100 text-danger',
  [BookingStatus.REJECTED]: 'bg-red-100 text-danger',
  [PaymentStatus.UNPAID]: 'bg-amber-100 text-amber-800',
  [PaymentStatus.PROCESSING]: 'bg-blue-100 text-secondary',
  [PaymentStatus.PAID]: 'bg-green-100 text-success',
  [PaymentStatus.REFUNDED]: 'bg-gray-100 text-text-secondary',
};

/** Props for rendering either a booking or payment status label. */
export interface BookingStatusBadgeProps {
  status: BookingStatus | PaymentStatus | string;
}

/** Thin wrapper around shared Badge with booking-specific color mapping. */
export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  return <Badge status={status} statusColorMap={BOOKING_STATUS_COLOR_MAP} />;
}
