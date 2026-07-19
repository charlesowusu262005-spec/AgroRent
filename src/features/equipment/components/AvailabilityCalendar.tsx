/**
 * @file        AvailabilityCalendar.tsx
 * @feature     Equipment
 * @description Read-only month grid showing booked vs available days for a listing.
 * @data        BookedDateRange
 * @author      MiStarStudio
 */

import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';
import { Text, View } from 'react-native';

import type { BookedDateRange } from '../types/equipment.types';

/** Props for the detail screen availability section. */
export interface AvailabilityCalendarProps {
  bookedRanges: BookedDateRange[];
  monthsToShow?: number;
}

/** Returns true when date falls inside any booked inclusive range. */
function isBooked(date: Date, ranges: BookedDateRange[]): boolean {
  return ranges.some((range) => {
    try {
      return isWithinInterval(date, {
        start: parseISO(range.startDate),
        end: parseISO(range.endDate),
      });
    } catch {
      return false;
    }
  });
}

/** Renders one or more month grids with green/red day cells and legend. */
export function AvailabilityCalendar({
  bookedRanges,
  monthsToShow = 1,
}: AvailabilityCalendarProps) {
  const today = new Date();
  // WHY: advance by ~32 days to step into successive months without date-fns addMonths
  const months = Array.from({ length: monthsToShow }, (_, i) =>
    addDays(startOfMonth(today), i * 32),
  );

  return (
    <View className="gap-4">
      {months.map((monthDate) => {
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);
        const days = eachDayOfInterval({ start, end });
        const monthLabel = format(monthDate, 'MMMM yyyy');

        return (
          <View key={monthLabel}>
            <Text className="mb-3 text-base font-semibold text-text-primary">
              {monthLabel}
            </Text>
            <View className="mb-2 flex-row">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text
                  key={`${day}-${index}`}
                  className="flex-1 text-center text-xs font-medium text-text-muted"
                >
                  {day}
                </Text>
              ))}
            </View>
            <View className="flex-row flex-wrap">
              {Array.from({ length: start.getDay() }).map((_, i) => (
                <View key={`pad-${i}`} className="mb-2 h-9 w-[14.28%]" />
              ))}
              {days.map((day) => {
                const booked = isBooked(day, bookedRanges);
                const isPast = day < today;

                return (
                  <View
                    key={day.toISOString()}
                    className="mb-2 h-9 w-[14.28%] items-center justify-center"
                  >
                    <View
                      className={`h-8 w-8 items-center justify-center rounded-full ${
                        isPast
                          ? 'bg-gray-100'
                          : booked
                            ? 'bg-red-100'
                            : 'bg-green-100'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          isPast
                            ? 'text-text-muted'
                            : booked
                              ? 'text-danger'
                              : 'text-primary'
                        }`}
                      >
                        {format(day, 'd')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center">
          <View className="mr-2 h-3 w-3 rounded-full bg-green-100" />
          <Text className="text-sm text-text-secondary">Available</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-2 h-3 w-3 rounded-full bg-red-100" />
          <Text className="text-sm text-text-secondary">Booked</Text>
        </View>
      </View>
    </View>
  );
}
