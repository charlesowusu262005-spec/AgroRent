/**
 * @file        TransactionCard.tsx
 * @feature     Payment
 * @description List row for a MoMo transaction with amount, provider, date, and status.
 * @data        Payment
 * @consumes    PaymentStatusIndicator, PROVIDER_LABELS, PROVIDER_COLORS
 * @author      MiStarStudio
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';

import { Card } from '../../../components';
import { PROVIDER_COLORS, PROVIDER_LABELS } from '../data/mockPaymentData';
import { PaymentProvider, type Payment } from '../types/payment.types';
import { PaymentStatusIndicator } from './PaymentStatusIndicator';

/** Props for a tappable transaction summary in the history list. */
export interface TransactionCardProps {
  payment: Payment;
  onPress: () => void;
}

/** Compact transaction row navigating to the full receipt screen on press. */
function TransactionCardComponent({ payment, onPress }: TransactionCardProps) {
  const colors = PROVIDER_COLORS[payment.provider];
  const dateLabel = payment.paidAt
    ? format(parseISO(payment.paidAt), 'dd MMM yyyy · HH:mm')
    : format(new Date(payment.initiatedAt), 'dd MMM yyyy · HH:mm');

  return (
    <Card onPress={onPress} padding="md" accessibilityLabel={`Transaction ${payment.providerReference}`}>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.bg }}
        >
          <Text className="text-xs font-bold" style={{ color: colors.text }}>
            {payment.provider === PaymentProvider.MTN_MOMO
              ? 'MTN'
              : payment.provider === PaymentProvider.VODAFONE_CASH
                ? 'VOD'
                : 'ATL'}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-text-primary">
            {payment.currency} {payment.amount.toFixed(2)}
          </Text>
          <Text className="mt-0.5 text-sm text-text-secondary">{PROVIDER_LABELS[payment.provider]}</Text>
          <Text className="mt-0.5 text-xs text-text-muted">{dateLabel}</Text>
        </View>
        <PaymentStatusIndicator status={payment.status} />
      </View>
      {payment.equipmentName ? (
        <Text className="mt-2 text-sm text-text-secondary" numberOfLines={1}>
          {payment.equipmentName}
        </Text>
      ) : null}
    </Card>
  );
}

export const TransactionCard = memo(TransactionCardComponent);
