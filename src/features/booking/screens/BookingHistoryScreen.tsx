/**
 * @file        BookingHistoryScreen.tsx
 * @feature     Booking
 * @description Farmer tab listing bookings segmented by upcoming, past, and cancelled.
 * @navigation  BookingStack > History
 * @data        bookingHistory
 * @consumes    BookingCard, fetchBookings
 * @author      MiStarStudio
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EmptyState, LoadingSpinner, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import { BookingCard } from '../components';
import { fetchBookings } from '../slices/bookingSlice';
import { BookingStatus } from '../types/booking.types';
import type { Booking } from '../types/booking.types';
import { Calendar } from 'lucide-react-native';

type Props = NativeStackScreenProps<BookingStackParamList, 'History'>;
type Segment = 'upcoming' | 'past' | 'cancelled';

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

/** Client-side segment filter — mirrors how the API will partition farmer history. */
function filterBookings(bookings: Booking[], segment: Segment): Booking[] {
  const today = new Date().toISOString().slice(0, 10);

  switch (segment) {
    case 'upcoming':
      return bookings.filter(
        (b) =>
          b.endDate >= today &&
          b.status !== BookingStatus.CANCELLED &&
          b.status !== BookingStatus.REJECTED,
      );
    case 'past':
      return bookings.filter(
        (b) =>
          b.endDate < today ||
          b.status === BookingStatus.COMPLETED ||
          b.status === BookingStatus.ACTIVE,
      );
    case 'cancelled':
      return bookings.filter(
        (b) =>
          b.status === BookingStatus.CANCELLED || b.status === BookingStatus.REJECTED,
      );
    default:
      return bookings;
  }
}

/** Farmer-facing booking list with pull-to-refresh and transaction shortcut. */
export function BookingHistoryScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { bookingHistory, isLoading } = useAppSelector((state) => state.booking);
  const user = useAppSelector((state) => state.auth.user);
  const [segment, setSegment] = useState<Segment>('upcoming');

  const loadBookings = useCallback(() => {
    void dispatch(
      fetchBookings({
        role: 'FARMER',
        userId: user?.id,
      }),
    );
  }, [dispatch, user?.id]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filtered = useMemo(
    () => filterBookings(bookingHistory, segment),
    [bookingHistory, segment],
  );

  return (
    <ScreenContainer className="px-0">
      {/* ─── Header & segment tabs ─── */}
      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-text-primary">My Bookings</Text>
          <Pressable
            onPress={() => navigation.navigate('TransactionHistory')}
            accessibilityRole="link"
          >
            <Text className="text-sm font-semibold text-primary">Transactions</Text>
          </Pressable>
        </View>
        <View className="mt-4 flex-row rounded-xl bg-gray-100 p-1">
          {SEGMENTS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setSegment(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: segment === item.key }}
              className={`flex-1 rounded-lg py-2 ${
                segment === item.key ? 'bg-surface' : ''
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  segment === item.key ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ─── Booking list ─── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6 grow"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadBookings} tintColor="#1A6B3A" />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingSpinner label="Loading bookings..." />
          ) : (
            <EmptyState
              icon={<Calendar size={32} color="#9CA3AF" />}
              title="No bookings here"
              subtitle="Your bookings will appear in this tab"
            />
          )
        }
        renderItem={({ item }) => (
          <View className="mb-3">
            <BookingCard
              booking={item}
              onPress={() => navigation.navigate('Detail', { bookingId: item.id })}
            />
          </View>
        )}
      />
    </ScreenContainer>
  );
}
