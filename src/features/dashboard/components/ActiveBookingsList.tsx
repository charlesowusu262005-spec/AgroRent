/**
 * @file        ActiveBookingsList.tsx
 * @feature     Dashboard
 * @description Horizontal or vertical list of compact booking cards for dashboard summaries.
 * @consumes    BookingCard
 * @author      MiStarStudio
 */

import { FlatList, Text } from 'react-native';

import { BookingCard } from '../../booking/components/BookingCard';
import type { Booking } from '../../booking/types/booking.types';

/** Props for rendering a scrollable or static booking card strip on dashboards. */
export interface ActiveBookingsListProps {
  bookings: Booking[];
  onBookingPress: (bookingId: string) => void;
  layout?: 'horizontal' | 'vertical';
  emptyMessage?: string;
  highlightPending?: boolean;
  showFarmer?: boolean;
}

/** Renders booking cards in horizontal carousel or vertical stack layout. */
export function ActiveBookingsList({
  bookings,
  onBookingPress,
  layout = 'vertical',
  emptyMessage = 'No active bookings',
  highlightPending = false,
  showFarmer = false,
}: ActiveBookingsListProps) {
  if (bookings.length === 0) {
    return <Text className="py-4 text-sm text-text-muted">{emptyMessage}</Text>;
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id}
      horizontal={layout === 'horizontal'}
      scrollEnabled={layout === 'horizontal'}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerClassName={layout === 'horizontal' ? 'pr-4' : undefined}
      renderItem={({ item }) => (
        <BookingCard
          booking={item}
          onPress={() => onBookingPress(item.id)}
          variant="compact"
          layout={layout}
          highlightPending={highlightPending}
          showFarmer={showFarmer}
        />
      )}
    />
  );
}
