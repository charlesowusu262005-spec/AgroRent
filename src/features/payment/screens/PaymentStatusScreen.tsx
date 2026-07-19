/**
 * @file        PaymentStatusScreen.tsx
 * @feature     Payment
 * @description Polls MoMo gateway and shows processing, success, or failure outcomes.
 * @navigation  BookingStack > PaymentStatus
 * @data        paymentId route param, currentPayment
 * @consumes    PaymentStatusIndicator, pollPaymentStatus
 * @author      MiStarStudio
 */

import { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import { updateDraftPaymentStatus } from '../../booking/slices/bookingSlice';
import { PaymentStatusIndicator } from '../components';
import { pollPaymentStatus } from '../slices/paymentSlice';
import { PaymentStatus, toDisplayStatus } from '../types/payment.types';

type Props = NativeStackScreenProps<BookingStackParamList, 'PaymentStatus'>;

/** Waits for farmer to approve MoMo prompt — polls every 3s until terminal state. */
export function PaymentStatusScreen({ navigation, route }: Props) {
  const { paymentId } = route.params;
  const dispatch = useAppDispatch();
  const payment = useAppSelector((state) =>
    state.payment.currentPayment?.id === paymentId
      ? state.payment.currentPayment
      : state.payment.transactionHistory.find((p) => p.id === paymentId),
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(() => {
    void dispatch(pollPaymentStatus(paymentId));
  }, [dispatch, paymentId]);

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [poll]);

  useEffect(() => {
    if (
      payment &&
      (payment.status === PaymentStatus.SUCCESS || payment.status === PaymentStatus.FAILED)
    ) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [payment]);

  useEffect(() => {
    if (payment?.status === PaymentStatus.SUCCESS && payment.returnFlow === 'confirm') {
      dispatch(updateDraftPaymentStatus());
    }
  }, [dispatch, payment]);

  if (!payment) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">Payment not found</Text>
      </ScreenContainer>
    );
  }

  const displayStatus = toDisplayStatus(payment.status);

  // ─── Processing state ──────────────────────────────────────────────────────

  if (displayStatus === 'PROCESSING') {
    return (
      <ScreenContainer accessibilityLabel="Payment processing">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#1A6B3A" />
          <Text className="mt-6 text-2xl font-bold text-text-primary">Processing payment</Text>
          <Text className="mt-3 text-center text-base text-text-secondary">
            Check your phone and approve the payment prompt
          </Text>
          <Text className="mt-2 text-center text-sm text-text-muted">
            Reference: {payment.providerReference}
          </Text>
          <View className="mt-6">
            <PaymentStatusIndicator status="PROCESSING" size="lg" />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ─── Success state ───────────────────────────────────────────────────────

  if (displayStatus === 'SUCCESS') {
    return (
      <ScreenContainer accessibilityLabel="Payment successful">
        <View className="flex-1 items-center justify-center px-6">
          <View className="rounded-full bg-green-100 p-6">
            <PaymentStatusIndicator status="SUCCESS" size="lg" label="Payment Successful" />
          </View>
          <Text className="mt-6 text-3xl font-bold text-primary">Payment Successful</Text>
          <Text className="mt-2 text-2xl font-bold text-text-primary">
            GHS {payment.amount.toFixed(2)}
          </Text>
          <Text className="mt-2 text-sm text-text-secondary">
            Ref: {payment.providerReference}
          </Text>
          <View className="mt-8 w-full gap-3">
            <Button
              label="View Receipt"
              onPress={() => navigation.replace('Receipt', { paymentId: payment.id })}
              fullWidth
            />
            {payment.returnFlow === 'confirm' ? (
              <Button
                label="Continue to confirm booking"
                variant="secondary"
                onPress={() => navigation.replace('Confirm')}
                fullWidth
              />
            ) : (
              <Button
                label="View booking"
                variant="secondary"
                onPress={() =>
                  navigation.replace('Detail', { bookingId: payment.bookingId })
                }
                fullWidth
              />
            )}
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ─── Failure state ─────────────────────────────────────────────────────────

  return (
    <ScreenContainer accessibilityLabel="Payment failed">
      <View className="flex-1 items-center justify-center px-6">
        <View className="rounded-full bg-red-100 p-6">
          <PaymentStatusIndicator status="FAILED" size="lg" label="Payment Failed" />
        </View>
        <Text className="mt-6 text-3xl font-bold text-danger">Payment Failed</Text>
        <Text className="mt-3 text-center text-base text-text-secondary">
          {payment.failureReason ?? 'The payment could not be completed. Please try again.'}
        </Text>
        <View className="mt-8 w-full">
          <Button
            label="Try Again"
            onPress={() => navigation.goBack()}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
