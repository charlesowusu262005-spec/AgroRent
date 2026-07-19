/**
 * @file        PaymentScreen.tsx
 * @feature     Payment
 * @description MoMo checkout for new booking drafts or unpaid existing bookings.
 * @navigation  BookingStack > Payment
 * @data        bookingDraft, bookingId route param
 * @consumes    PaymentMethodSelector, MoMoPayForm, RentalCostEstimator, initiatePayment
 * @author      MiStarStudio
 */

import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import { RentalCostEstimator, EquipmentSummaryRow } from '../../booking/components';
import {
  MoMoPayForm,
  PaymentMethodSelector,
  getMoMoPhoneError,
} from '../components';
import { initiatePayment } from '../slices/paymentSlice';
import { PaymentProvider } from '../types/payment.types';
import { stripPhoneDigits } from '../utils/phoneValidation';

type Props = NativeStackScreenProps<BookingStackParamList, 'Payment'>;

/** Dual-mode payment — supports pre-confirm draft flow and pay-later from booking detail. */
export function PaymentScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.booking.bookingDraft);
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.payment.isLoading);
  const existingBooking = useAppSelector((state) =>
    route.params?.bookingId
      ? state.booking.bookingHistory.find((b) => b.id === route.params?.bookingId)
      : undefined,
  );

  const [provider, setProvider] = useState(PaymentProvider.MTN_MOMO);
  const [phone, setPhone] = useState('');

  const summary = useMemo(() => {
    if (draft) {
      return {
        bookingId: 'draft',
        equipmentName: draft.equipmentName,
        equipmentImage: draft.equipmentImage,
        totalDays: draft.totalDays,
        dailyRate: draft.dailyRate,
        totalCost: draft.totalCost,
        returnFlow: 'confirm' as const,
      };
    }
    if (existingBooking) {
      return {
        bookingId: existingBooking.id,
        equipmentName: existingBooking.equipmentName,
        equipmentImage: existingBooking.equipmentImage,
        totalDays: existingBooking.totalDays,
        dailyRate: Math.round(existingBooking.totalCost / existingBooking.totalDays),
        totalCost: existingBooking.totalCost,
        returnFlow: 'receipt' as const,
      };
    }
    return null;
  }, [draft, existingBooking]);

  useEffect(() => {
    if (user?.phone) {
      setPhone(stripPhoneDigits(user.phone));
    }
  }, [user?.phone]);

  if (!summary) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">No payment details found.</Text>
      </ScreenContainer>
    );
  }

  const handlePay = async () => {
    const phoneToUse = phone || stripPhoneDigits(user?.phone ?? '');
    const phoneError = getMoMoPhoneError(phoneToUse, provider);
    if (phoneError) return;

    const result = await dispatch(
      initiatePayment({
        bookingId: summary.bookingId,
        amount: summary.totalCost,
        provider,
        phoneNumber: phoneToUse,
        equipmentName: summary.equipmentName,
        returnFlow: summary.returnFlow,
      }),
    );

    if (initiatePayment.fulfilled.match(result)) {
      navigation.navigate('PaymentStatus', { paymentId: result.payload.id });
    }
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Payment">
      <Text className="mb-4 text-2xl font-bold text-text-primary">Pay with Mobile Money</Text>
      <Text className="mb-6 text-base text-text-secondary">
        Approve the prompt on your phone to complete payment
      </Text>

      <EquipmentSummaryRow
        imageUri={summary.equipmentImage}
        title={summary.equipmentName}
        priceLabel={`GHS ${summary.totalCost.toFixed(2)}`}
      />

      <RentalCostEstimator
        totalDays={summary.totalDays}
        dailyRate={summary.dailyRate}
        totalCost={summary.totalCost}
      />

      <Text className="mb-3 mt-6 text-base font-semibold text-text-primary">
        Select payment method
      </Text>
      <PaymentMethodSelector selected={provider} onSelect={setProvider} />

      <View className="mt-6">
        <MoMoPayForm
          provider={provider}
          phone={phone}
          onChangePhone={setPhone}
          defaultPhone={user?.phone ? stripPhoneDigits(user.phone) : undefined}
        />
      </View>

      <View className="mt-8 mb-6">
        <Button
          label={`Pay GHS ${summary.totalCost.toFixed(2)}`}
          onPress={handlePay}
          loading={isLoading}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}
