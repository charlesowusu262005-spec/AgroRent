/**
 * @file        PaymentStatusIndicator.tsx
 * @feature     Payment
 * @description Icon + label badge for processing, success, failed, and reversed payment states.
 * @data        PaymentStatus, PaymentDisplayStatus, toDisplayStatus
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import { AlertCircle, CheckCircle, Clock, RotateCcw } from 'lucide-react-native';

import {
  PaymentStatus,
  toDisplayStatus,
  type PaymentDisplayStatus,
} from '../types/payment.types';

/** Props for inline or hero-sized payment status display. */
export interface PaymentStatusIndicatorProps {
  status: PaymentStatus | PaymentDisplayStatus;
  size?: 'sm' | 'lg';
  label?: string;
}

const CONFIG: Record<
  PaymentDisplayStatus,
  { icon: typeof CheckCircle; color: string; bg: string; defaultLabel: string }
> = {
  PROCESSING: {
    icon: Clock,
    color: '#F59E0B',
    bg: 'bg-amber-100',
    defaultLabel: 'Processing',
  },
  SUCCESS: {
    icon: CheckCircle,
    color: '#16A34A',
    bg: 'bg-green-100',
    defaultLabel: 'Successful',
  },
  FAILED: {
    icon: AlertCircle,
    color: '#DC2626',
    bg: 'bg-red-100',
    defaultLabel: 'Failed',
  },
};

/** Maps raw gateway status to farmer-friendly label with optional reversed override. */
export function PaymentStatusIndicator({
  status,
  size = 'sm',
  label,
}: PaymentStatusIndicatorProps) {
  const displayStatus =
    status === 'PROCESSING' || status === 'SUCCESS' || status === 'FAILED'
      ? status
      : toDisplayStatus(status as PaymentStatus);

  const reversed = status === PaymentStatus.REVERSED;
  const config = CONFIG[displayStatus];
  const Icon = reversed ? RotateCcw : config.icon;
  const iconSize = size === 'lg' ? 48 : 16;
  const containerClass = size === 'lg' ? 'p-6' : 'px-2 py-1';
  const textClass = size === 'lg' ? 'text-lg font-semibold' : 'text-xs font-semibold';

  return (
    <View className={`flex-row items-center rounded-full ${config.bg} ${containerClass}`}>
      <Icon size={iconSize} color={reversed ? '#6B7280' : config.color} />
      <Text
        className={`ml-2 ${textClass}`}
        style={{ color: reversed ? '#6B7280' : config.color }}
      >
        {label ?? (reversed ? 'Reversed' : config.defaultLabel)}
      </Text>
    </View>
  );
}
