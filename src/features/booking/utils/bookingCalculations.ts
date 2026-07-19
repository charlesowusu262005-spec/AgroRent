/**
 * @file        bookingCalculations.ts
 * @feature     Booking
 * @description Pure date and cost helpers for rental duration, pricing, and availability checks.
 * @data        calculateRentalDays, calculateRentalCost, isDateUnavailable, isRangeUnavailable
 * @author      MiStarStudio
 */

import {
  differenceInCalendarDays,
  eachDayOfInterval,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';

import type { UnavailableDateRange } from '../types/booking.types';

/** Inclusive calendar-day count between ISO start and end (both dates count as rental days). */
export function calculateRentalDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const days = differenceInCalendarDays(parseISO(endDate), parseISO(startDate));
  return Math.max(days + 1, 0);
}

/** Simple daily-rate multiplication — weekly discounts handled at listing level later. */
export function calculateRentalCost(dailyRate: number, totalDays: number): number {
  return dailyRate * totalDays;
}

/** Returns true when the day is in the past or falls inside a blocked availability range. */
export function isDateUnavailable(
  date: Date,
  unavailableRanges: UnavailableDateRange[],
): boolean {
  const day = startOfDay(date);
  const today = startOfDay(new Date());
  // Past dates cannot be selected — prevents back-dated rental requests
  if (day < today) return true;

  return unavailableRanges.some((range) => {
    try {
      return isWithinInterval(day, {
        start: startOfDay(parseISO(range.startDate)),
        end: startOfDay(parseISO(range.endDate)),
      });
    } catch {
      return false;
    }
  });
}

/** True when any day in the selected span overlaps blocked or past dates. */
export function isRangeUnavailable(
  startDate: string,
  endDate: string,
  unavailableRanges: UnavailableDateRange[],
): boolean {
  if (!startDate || !endDate) return false;

  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  return days.some((day) => isDateUnavailable(day, unavailableRanges));
}
