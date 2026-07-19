/**
 * @file        BookingCard.tsx
 * @feature     Booking
 * @description List card showing equipment thumbnail, dates, cost, and dual status badges.
 * @data        Booking
 * @consumes    BookingStatusBadge, CachedImage, Card
 * @author      MiStarStudio
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { Calendar } from 'lucide-react-native';

import { CachedImage, Card } from '../../../components';
import type { Booking } from '../types/booking.types';
import { BookingStatus } from '../types/booking.types';
import { BookingStatusBadge } from './BookingStatusBadge';

/** Props for a tappable booking summary row in history and management lists. */
export interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  /** When true, shows farmer name instead of owner — used on owner management screen. */
  showFarmer?: boolean;
  /** Compact layout for dashboard carousels; full layout for booking management lists. */
  variant?: 'full' | 'compact';
  layout?: 'horizontal' | 'vertical';
  highlightPending?: boolean;
}

/** Fixed height for FlatList getItemLayout optimization when virtualizing booking lists. */
export const BOOKING_CARD_HEIGHT = 120;

/** Memoized booking row — avoids re-render when parent list scrolls unrelated items. */
function BookingCardComponent({
  booking,
  onPress,
  showFarmer = false,
  variant = 'full',
  layout = 'vertical',
  highlightPending = false,
}: BookingCardProps) {
  const isPending = booking.status === BookingStatus.PENDING;
  const isCompact = variant === 'compact';
  const widthClass = layout === 'horizontal' ? 'w-64' : 'w-full';
  const spacingClass = layout === 'horizontal' ? 'mr-3' : 'mb-3';

  const card = (
    <Card
      onPress={onPress}
      padding="md"
      accessibilityLabel={`Booking for ${booking.equipmentName}`}
    >
      <View className="flex-row">
        <CachedImage
          uri={booking.equipmentImage}
          className={`rounded-xl bg-gray-200 ${isCompact ? 'h-16 w-16' : 'h-20 w-20'}`}
          accessibilityLabel={`${booking.equipmentName} thumbnail`}
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-start justify-between">
            <Text
              className={`flex-1 pr-2 font-semibold text-text-primary ${isCompact ? 'text-sm' : 'text-base'}`}
              numberOfLines={1}
            >
              {booking.equipmentName}
            </Text>
            <BookingStatusBadge status={booking.status} />
          </View>
          <Text className={`mt-1 text-text-secondary ${isCompact ? 'text-xs' : 'text-sm'}`} numberOfLines={1}>
            {showFarmer ? booking.farmerName : booking.ownerName}
          </Text>
          <View className="mt-2 flex-row items-center">
            <Calendar size={isCompact ? 12 : 14} color="#6B7280" />
            <Text className={`ml-1 text-text-secondary ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {booking.startDate} → {booking.endDate}
            </Text>
          </View>
          <View className={`mt-2 flex-row items-center ${isCompact ? '' : 'justify-between'}`}>
            <Text className={`font-bold text-primary ${isCompact ? 'text-sm' : 'text-base'}`}>
              GHS {booking.totalCost}
            </Text>
            {!isCompact ? <BookingStatusBadge status={booking.paymentStatus} /> : null}
          </View>
          {isCompact && highlightPending && isPending ? (
            <Text className="mt-1 text-xs font-semibold text-accent">Action required</Text>
          ) : null}
        </View>
      </View>
    </Card>
  );

  if (!isCompact) {
    return card;
  }

  return (
    <View className={`${widthClass} ${spacingClass}`}>
      <View
        className={
          highlightPending && isPending
            ? 'overflow-hidden rounded-2xl border-2 border-accent bg-accent/5'
            : undefined
        }
      >
        {card}
      </View>
    </View>
  );
}

export const BookingCard = memo(BookingCardComponent);
