/**
 * @file        BookingRequestScreen.tsx
 * @feature     Booking
 * @description Farmer flow to pick rental dates, estimate cost, and proceed to MoMo payment.
 * @navigation  BookingStack > Request
 * @data        equipmentId route param, bookingDraft
 * @consumes    DateRangePicker, RentalCostEstimator, setBookingDraft, mockBookingData
 * @author      MiStarStudio
 */

import { useEffect, useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useAppDispatch } from '../../../app/hooks';
import { Button, LoadingSpinner, ScreenContainer } from '../../../components';
import type {
  BookingStackParamList,
  FarmerTabParamList,
} from '../../../navigation/types';
import { getMockEquipmentById } from '../../equipment/data/mockEquipmentData';
import { fetchEquipmentById } from '../../equipment/slices/equipmentSlice';
import { getUnavailableRanges } from '../data/mockBookingData';
import {
  DateRangePicker,
  EquipmentSummaryRow,
  RentalCostEstimator,
} from '../components';
import { setBookingDraft } from '../slices/bookingSlice';
import {
  calculateRentalCost,
  calculateRentalDays,
  isRangeUnavailable,
} from '../utils/bookingCalculations';

type Props = CompositeScreenProps<
  NativeStackScreenProps<BookingStackParamList, 'Request'>,
  BottomTabScreenProps<FarmerTabParamList>
>;

/** First step of the booking funnel — collects dates and notes before payment. */
export function BookingRequestScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const equipmentId = route.params?.equipmentId ?? '';
  const equipment = getMockEquipmentById(equipmentId);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [dateError, setDateError] = useState<string | undefined>();
  const [loading, setLoading] = useState(!equipment);

  const unavailableRanges = useMemo(
    () => (equipmentId ? getUnavailableRanges(equipmentId) : []),
    [equipmentId],
  );

  const totalDays = calculateRentalDays(startDate, endDate);
  const dailyRate = equipment?.dailyRate ?? 0;
  const totalCost = calculateRentalCost(dailyRate, totalDays);

  useEffect(() => {
    if (equipmentId) {
      void dispatch(fetchEquipmentById(equipmentId)).finally(() => setLoading(false));
    }
  }, [dispatch, equipmentId]);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setDateError(undefined);
  };

  const handleContinue = () => {
    if (!equipment || !startDate || !endDate) {
      setDateError('Please select a start and end date');
      return;
    }
    if (isRangeUnavailable(startDate, endDate, unavailableRanges)) {
      setDateError('Selected dates include unavailable days');
      return;
    }

    const draft = {
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      equipmentImage: equipment.images[0],
      ownerId: equipment.ownerId,
      ownerName: equipment.ownerName,
      dailyRate: equipment.dailyRate,
      startDate,
      endDate,
      totalDays,
      totalCost,
      notes: notes.trim() || undefined,
    };

    dispatch(setBookingDraft(draft));
    // Payment precedes confirm — farmer pays before owner sees the request
    navigation.navigate('Payment');
  };

  if (loading || !equipment) {
    return <LoadingSpinner label="Loading equipment..." />;
  }

  return (
    <ScreenContainer scrollable accessibilityLabel="Booking request">
      <Text className="mb-4 text-2xl font-bold text-text-primary">Request booking</Text>

      <EquipmentSummaryRow
        imageUri={equipment.images[0]}
        title={equipment.name}
        lines={[equipment.locationName]}
        priceLabel={`GHS ${equipment.dailyRate}/day`}
      />

      <Text className="mb-3 text-base font-semibold text-text-primary">Select rental dates</Text>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        unavailableRanges={unavailableRanges}
        onChange={handleDateChange}
        error={dateError}
      />

      <View className="mt-6">
        <RentalCostEstimator
          totalDays={totalDays}
          dailyRate={dailyRate}
          totalCost={totalCost}
        />
      </View>

      <View className="mt-6">
        <Text className="mb-1.5 text-sm font-medium text-text-primary">
          Notes for owner (optional)
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholder="Farm location, access instructions, etc."
          placeholderTextColor="#9CA3AF"
          className="min-h-[80px] rounded-xl border border-gray-300 bg-surface px-3 py-3 text-base text-text-primary"
        />
      </View>

      <View className="mt-8 mb-6">
        <Button
          label="Continue to Payment"
          onPress={handleContinue}
          disabled={totalDays === 0}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}
