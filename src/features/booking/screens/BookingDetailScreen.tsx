/**
 * @file        BookingDetailScreen.tsx
 * @feature     Booking
 * @description Full booking detail with owner contact, policy, pay/cancel/review actions.
 * @navigation  BookingStack > Detail
 * @data        bookingId route param, activeBooking
 * @consumes    BookingStatusBadge, CancellationPolicyCard, cancelBooking
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Phone, User } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, Card, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import {
  BookingStatusBadge,
  CancellationPolicyCard,
} from '../components';
import {
  cancelBooking,
  setActiveBooking,
} from '../slices/bookingSlice';
import { BookingStatus, PaymentStatus } from '../types/booking.types';

type Props = NativeStackScreenProps<BookingStackParamList, 'Detail'>;

/** Single booking view — action buttons gated by status and payment state. */
export function BookingDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const dispatch = useAppDispatch();
  const booking = useAppSelector(
    (state) =>
      state.booking.bookingHistory.find((b) => b.id === bookingId) ??
      state.booking.activeBooking,
  );

  useEffect(() => {
    if (booking) {
      dispatch(setActiveBooking(booking));
    }
  }, [booking, dispatch]);

  if (!booking) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">Booking not found</Text>
      </ScreenContainer>
    );
  }

  const canCancel =
    booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;
  const canPay = booking.paymentStatus === PaymentStatus.UNPAID &&
    booking.status !== BookingStatus.CANCELLED &&
    booking.status !== BookingStatus.REJECTED;
  const canReview = booking.status === BookingStatus.COMPLETED;

  const handleCancel = () => {
    Alert.alert('Cancel booking?', 'This action may be subject to the cancellation policy.', [
      { text: 'Keep booking', style: 'cancel' },
      {
        text: 'Cancel booking',
        style: 'destructive',
        onPress: () => void dispatch(cancelBooking(bookingId)),
      },
    ]);
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Booking detail">
      {/* ─── Header & equipment summary ─── */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-text-primary">Booking details</Text>
        <BookingStatusBadge status={booking.status} />
      </View>

      <View className="mb-4 flex-row rounded-2xl border border-gray-200 bg-surface p-3">
        <Image
          source={{ uri: booking.equipmentImage }}
          className="h-24 w-24 rounded-xl bg-gray-200"
        />
        <View className="ml-3 flex-1 justify-center">
          <Text className="text-lg font-semibold text-text-primary">{booking.equipmentName}</Text>
          <Text className="mt-1 text-sm text-text-secondary">
            {booking.startDate} → {booking.endDate}
          </Text>
          <Text className="mt-1 text-sm text-text-secondary">
            {booking.totalDays} days · GHS {booking.totalCost}
          </Text>
          <View className="mt-2">
            <BookingStatusBadge status={booking.paymentStatus} />
          </View>
        </View>
      </View>

      <Card padding="md">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Equipment owner
        </Text>
        <View className="flex-row items-center">
          <View className="rounded-full bg-primary/10 p-2">
            <User size={20} color="#1A6B3A" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-text-primary">{booking.ownerName}</Text>
            <View className="mt-1 flex-row items-center">
              <Phone size={14} color="#6B7280" />
              {/* TODO(api): replace with owner phone from booking detail endpoint */}
              <Text className="ml-1 text-sm text-text-secondary">+233 24 000 0000</Text>
            </View>
          </View>
        </View>
      </Card>

      {booking.notes ? (
        <View className="mt-4 rounded-xl bg-gray-50 p-4">
          <Text className="text-sm font-medium text-text-primary">Notes</Text>
          <Text className="mt-1 text-sm text-text-secondary">{booking.notes}</Text>
        </View>
      ) : null}

      {booking.rejectReason ? (
        <View className="mt-4 rounded-xl bg-red-50 p-4">
          <Text className="text-sm font-medium text-danger">Rejection reason</Text>
          <Text className="mt-1 text-sm text-text-secondary">{booking.rejectReason}</Text>
        </View>
      ) : null}

      <View className="mt-4">
        <CancellationPolicyCard />
      </View>

      {/* ─── Contextual actions ─── */}
      <View className="mt-6 gap-3 pb-6">
        {canPay ? (
          <Button
            label="Pay Now"
            onPress={() => navigation.navigate('Payment', { bookingId })}
            fullWidth
          />
        ) : null}
        {canCancel ? (
          <Button label="Cancel Booking" onPress={handleCancel} variant="danger" fullWidth />
        ) : null}
        {canReview ? (
          <Button
            label="Leave Review"
            onPress={() => Alert.alert('Reviews', 'Review flow coming in a later phase.')}
            variant="secondary"
            fullWidth
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}
