/**
 * @file        ReceiptScreen.tsx
 * @feature     Payment
 * @description Official payment receipt with share, PDF placeholder, and booking link.
 * @navigation  BookingStack > Receipt
 * @data        paymentId route param
 * @consumes    PaymentStatusIndicator, fetchReceipt, formatReceiptText
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import { Alert, Share, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format, parseISO } from 'date-fns';
import { Sprout } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, LoadingSpinner, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import { PaymentStatusIndicator } from '../components';
import { PROVIDER_LABELS } from '../data/mockPaymentData';
import { fetchReceipt } from '../slices/paymentSlice';
import { formatReceiptText } from '../utils/receiptFormatter';

type Props = NativeStackScreenProps<BookingStackParamList, 'Receipt'>;

/** Full receipt view — share uses plain text until PDF endpoint is available. */
export function ReceiptScreen({ navigation, route }: Props) {
  const { paymentId } = route.params;
  const dispatch = useAppDispatch();
  const payment = useAppSelector((state) =>
    state.payment.transactionHistory.find((p) => p.id === paymentId) ??
    (state.payment.currentPayment?.id === paymentId ? state.payment.currentPayment : null),
  );
  const booking = useAppSelector((state) =>
    payment ? state.booking.bookingHistory.find((b) => b.id === payment.bookingId) : undefined,
  );
  const isLoading = useAppSelector((state) => state.payment.isLoading);

  useEffect(() => {
    void dispatch(fetchReceipt(paymentId));
  }, [dispatch, paymentId]);

  if (!payment) {
    return isLoading ? (
      <LoadingSpinner label="Loading receipt..." />
    ) : (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">Receipt not found</Text>
      </ScreenContainer>
    );
  }

  const paidAt = payment.paidAt
    ? format(parseISO(payment.paidAt), 'dd MMMM yyyy · HH:mm')
    : '—';

  const receiptText = formatReceiptText(payment);

  const handleShare = async () => {
    try {
      await Share.share({ message: receiptText, title: 'AgroRent Payment Receipt' });
    } catch {
      Alert.alert('Share failed', 'Could not open the share sheet.');
    }
  };

  const handleDownloadPdf = async () => {
    // TODO(api): replace with GET /payments/{id}/receipt PDF generation
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Download unavailable', 'Sharing is not available on this device.');
      return;
    }
    Alert.alert(
      'Download PDF',
      'PDF receipt download will be available when the backend receipt endpoint is connected.',
    );
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Payment receipt">
      {/* ─── Receipt header ─── */}
      <View className="items-center border-b border-gray-200 pb-6">
        <View className="mb-3 rounded-full bg-primary/10 p-4">
          <Sprout size={36} color="#1A6B3A" />
        </View>
        <Text className="text-2xl font-bold text-primary">AgroRent Ghana</Text>
        <Text className="mt-1 text-sm text-text-secondary">Official Payment Receipt</Text>
      </View>

      {/* ─── Receipt line items ─── */}
      <View className="mt-6 gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-text-secondary">Status</Text>
          <PaymentStatusIndicator status={payment.status} />
        </View>
        <ReceiptRow label="Reference" value={payment.providerReference} />
        <ReceiptRow label="Payment ID" value={payment.id} />
        <ReceiptRow label="Date" value={paidAt} />
        <ReceiptRow label="Booking ID" value={payment.bookingId} />
        {payment.equipmentName || booking?.equipmentName ? (
          <ReceiptRow
            label="Equipment"
            value={payment.equipmentName ?? booking?.equipmentName ?? '—'}
          />
        ) : null}
        {booking ? (
          <ReceiptRow label="Rental period" value={`${booking.startDate} → ${booking.endDate}`} />
        ) : null}
        <ReceiptRow label="Payment method" value={PROVIDER_LABELS[payment.provider]} />
        <ReceiptRow label="Phone" value={`+233 ${payment.phoneNumber}`} />
        <View className="mt-2 rounded-2xl bg-primary/5 p-4">
          <Text className="text-sm text-text-secondary">Amount paid</Text>
          <Text className="mt-1 text-3xl font-bold text-primary">
            {payment.currency} {payment.amount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* ─── Actions ─── */}
      <View className="mt-8 gap-3 pb-6">
        <Button label="Share Receipt" onPress={handleShare} fullWidth />
        <Button label="Download PDF" onPress={handleDownloadPdf} variant="secondary" fullWidth />
        {payment.bookingId !== 'draft' ? (
          <Button
            label="View booking"
            variant="ghost"
            onPress={() => navigation.navigate('Detail', { bookingId: payment.bookingId })}
            fullWidth
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}

/** Single label/value row in the receipt detail section. */
function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between border-b border-gray-100 py-2">
      <Text className="text-sm text-text-secondary">{label}</Text>
      <Text className="max-w-[60%] text-right text-sm font-medium text-text-primary">{value}</Text>
    </View>
  );
}
