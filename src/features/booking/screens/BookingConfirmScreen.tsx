/**
 * @file        BookingConfirmScreen.tsx
 * @feature     Booking
 * @description Final review step after successful MoMo payment — submits the rental request.
 * @navigation  BookingStack > Confirm
 * @data        bookingDraft, activeBooking
 * @consumes    RentalCostEstimator, createBooking
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import { RentalCostEstimator, EquipmentSummaryRow } from '../components';
import { createBooking } from '../slices/bookingSlice';

type Props = NativeStackScreenProps<BookingStackParamList, 'Confirm'>;

/** Post-payment confirmation — persists draft as a PENDING booking for owner review. */
export function BookingConfirmScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.booking.bookingDraft);
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.booking.isLoading);

  if (!draft) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">No booking to confirm.</Text>
      </ScreenContainer>
    );
  }

  const handleConfirm = async () => {
    const result = await dispatch(
      createBooking({
        draft,
        farmerId: user?.id ?? 'farmer-1',
        farmerName: user?.name ?? 'Demo User',
      }),
    );

    if (createBooking.fulfilled.match(result)) {
      navigation.replace('Detail', { bookingId: result.payload.id });
    }
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Confirm booking">
      <Text className="mb-4 text-2xl font-bold text-text-primary">Confirm booking</Text>
      <Text className="mb-6 text-base text-text-secondary">
        Review your rental details before submitting
      </Text>

      <EquipmentSummaryRow
        imageUri={draft.equipmentImage}
        title={draft.equipmentName}
        lines={[`Owner: ${draft.ownerName}`, `${draft.startDate} → ${draft.endDate}`]}
      />

      <RentalCostEstimator
        totalDays={draft.totalDays}
        dailyRate={draft.dailyRate}
        totalCost={draft.totalCost}
      />

      {draft.notes ? (
        <View className="mt-4 rounded-xl bg-gray-50 p-4">
          <Text className="text-sm font-medium text-text-primary">Your notes</Text>
          <Text className="mt-1 text-sm text-text-secondary">{draft.notes}</Text>
        </View>
      ) : null}

      <View className="mt-8 mb-6">
        <Button
          label="Confirm Booking Request"
          onPress={handleConfirm}
          loading={isLoading}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}
