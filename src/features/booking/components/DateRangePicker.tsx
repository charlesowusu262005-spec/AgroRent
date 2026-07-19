/**
 * @file        DateRangePicker.tsx
 * @feature     Booking
 * @description Month calendar for selecting inclusive rental start/end dates with blocked-day styling.
 * @data        UnavailableDateRange
 * @consumes    bookingCalculations.isDateUnavailable
 * @author      MiStarStudio
 */

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfDay,
} from 'date-fns';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { UnavailableDateRange } from '../types/booking.types';
import { isDateUnavailable } from '../utils/bookingCalculations';

/** Controlled date-range picker with month navigation and availability constraints. */
export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  unavailableRanges: UnavailableDateRange[];
  onChange: (startDate: string, endDate: string) => void;
  error?: string;
}

/** Two-tap range selection — first tap sets start, second sets end if no blocked days in between. */
export function DateRangePicker({
  startDate,
  endDate,
  unavailableRanges,
  onChange,
  error,
}: DateRangePickerProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectingEnd, setSelectingEnd] = useState(false);

  const monthDate = addMonths(startOfMonth(new Date()), monthOffset);
  const days = eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  });

  const handleSelect = (day: Date) => {
    if (isDateUnavailable(day, unavailableRanges)) return;

    const iso = format(day, 'yyyy-MM-dd');

    if (!selectingEnd || !startDate) {
      onChange(iso, '');
      setSelectingEnd(true);
      return;
    }

    const start = parseISO(startDate);
    // If user taps an earlier day while picking end, restart range from that day
    if (day < start) {
      onChange(iso, '');
      setSelectingEnd(true);
      return;
    }

    const rangeDays = eachDayOfInterval({ start, end: day });
    const hasBlocked = rangeDays.some((d) => isDateUnavailable(d, unavailableRanges));
    if (hasBlocked) return;

    onChange(startDate, iso);
    setSelectingEnd(false);
  };

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false;
    try {
      return isWithinInterval(day, {
        start: startOfDay(parseISO(startDate)),
        end: startOfDay(parseISO(endDate)),
      });
    } catch {
      return false;
    }
  };

  const isStart = (day: Date) => startDate === format(day, 'yyyy-MM-dd');
  const isEnd = (day: Date) => endDate === format(day, 'yyyy-MM-dd');

  return (
    <View>
      {/* ─── Month navigation ─── */}
      <View className="mb-3 flex-row items-center justify-between">
        <Pressable onPress={() => setMonthOffset((m) => m - 1)} accessibilityRole="button">
          <Text className="text-primary">‹</Text>
        </Pressable>
        <Text className="text-base font-semibold text-text-primary">
          {format(monthDate, 'MMMM yyyy')}
        </Text>
        <Pressable onPress={() => setMonthOffset((m) => m + 1)} accessibilityRole="button">
          <Text className="text-primary">›</Text>
        </Pressable>
      </View>

      <View className="mb-2 flex-row">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
          <Text
            key={`${label}-${index}`}
            className="flex-1 text-center text-xs font-medium text-text-muted"
          >
            {label}
          </Text>
        ))}
      </View>

      {/* ─── Day grid ─── */}
      <View className="flex-row flex-wrap">
        {Array.from({ length: startOfMonth(monthDate).getDay() }).map((_, i) => (
          <View key={`pad-${i}`} className="mb-2 h-10 w-[14.28%]" />
        ))}
        {days.map((day) => {
          const unavailable = isDateUnavailable(day, unavailableRanges);
          const selected = isInRange(day) || isStart(day) || isEnd(day);

          return (
            <Pressable
              key={day.toISOString()}
              disabled={unavailable}
              onPress={() => handleSelect(day)}
              accessibilityRole="button"
              accessibilityState={{ disabled: unavailable, selected }}
              className="mb-2 h-10 w-[14.28%] items-center justify-center"
            >
              <View
                className={`h-9 w-9 items-center justify-center rounded-full ${
                  unavailable
                    ? 'bg-red-50'
                    : selected
                      ? 'bg-primary'
                      : 'bg-transparent'
                }`}
              >
                <Text
                  className={`text-sm ${
                    unavailable
                      ? 'text-danger/50 line-through'
                      : selected
                        ? 'font-bold text-white'
                        : 'text-text-primary'
                  }`}
                >
                  {format(day, 'd')}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text className="mt-2 text-sm text-text-secondary">
        {startDate && endDate
          ? `${startDate} → ${endDate}`
          : startDate
            ? 'Select end date'
            : 'Select start date'}
      </Text>
      {error ? (
        <Text className="mt-1 text-sm text-danger" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
