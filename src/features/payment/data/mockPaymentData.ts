/**
 * @file        mockPaymentData.ts
 * @feature     Payment
 * @description Static MoMo transaction history and provider branding for offline/dev use.
 * @data        MOCK_TRANSACTIONS, PROVIDER_LABELS, PROVIDER_COLORS, generatePaymentId, generateReference
 * @author      MiStarStudio
 */

import { format } from 'date-fns';

import { PaymentProvider, PaymentStatus } from '../types/payment.types';
import type { Payment } from '../types/payment.types';

/** Human-readable labels for each Ghana MoMo provider. */
export const PROVIDER_LABELS: Record<PaymentProvider, string> = {
  [PaymentProvider.MTN_MOMO]: 'MTN MoMo',
  [PaymentProvider.VODAFONE_CASH]: 'Vodafone Cash',
  [PaymentProvider.AIRTELTIGO]: 'AirtelTigo Money',
};

/** Brand colors for provider cards and transaction list icons. */
export const PROVIDER_COLORS: Record<PaymentProvider, { bg: string; border: string; text: string }> = {
  [PaymentProvider.MTN_MOMO]: { bg: '#FFCC00', border: '#E6B800', text: '#1A1A1A' },
  [PaymentProvider.VODAFONE_CASH]: { bg: '#E60000', border: '#CC0000', text: '#FFFFFF' },
  [PaymentProvider.AIRTELTIGO]: { bg: '#0066CC', border: '#0055AA', text: '#FFFFFF' },
};

const today = new Date();

// TODO(api): replace with GET /payments/transactions — remove static seed data
export const MOCK_TRANSACTIONS: Payment[] = [
  {
    id: 'pay-001',
    bookingId: 'bk-002',
    amount: 660,
    currency: 'GHS',
    provider: PaymentProvider.MTN_MOMO,
    providerReference: 'AGR-MTN-20260201-8842',
    phoneNumber: '241234567',
    status: PaymentStatus.SUCCESS,
    paidAt: format(today, "yyyy-MM-dd'T'10:30:00"),
    equipmentName: 'John Deere 5075E',
    initiatedAt: today.getTime() - 86400000 * 3,
    returnFlow: 'receipt',
  },
  {
    id: 'pay-002',
    bookingId: 'bk-003',
    amount: 380,
    currency: 'GHS',
    provider: PaymentProvider.VODAFONE_CASH,
    providerReference: 'AGR-VOD-20260120-3310',
    phoneNumber: '501234567',
    status: PaymentStatus.SUCCESS,
    paidAt: format(today, "yyyy-MM-dd'T'14:15:00"),
    equipmentName: 'Solar Drip Irrigation Kit',
    initiatedAt: today.getTime() - 86400000 * 10,
    returnFlow: 'receipt',
  },
  {
    id: 'pay-003',
    bookingId: 'bk-004',
    amount: 1350,
    currency: 'GHS',
    provider: PaymentProvider.AIRTELTIGO,
    providerReference: 'AGR-ATL-20260115-9921',
    phoneNumber: '271234567',
    status: PaymentStatus.REVERSED,
    paidAt: format(today, "yyyy-MM-dd'T'09:00:00"),
    equipmentName: 'Kubota DC-70 Combine',
    initiatedAt: today.getTime() - 86400000 * 15,
    returnFlow: 'receipt',
  },
  {
    id: 'pay-004',
    bookingId: 'bk-001',
    amount: 720,
    currency: 'GHS',
    provider: PaymentProvider.MTN_MOMO,
    providerReference: 'AGR-MTN-20260210-1102',
    phoneNumber: '559876543',
    status: PaymentStatus.FAILED,
    failureReason: 'Payment prompt timed out',
    equipmentName: 'Massey Ferguson 375',
    initiatedAt: today.getTime() - 86400000,
    returnFlow: 'receipt',
  },
];

/** Generates a client-side payment id until the API assigns persistent ids. */
export function generatePaymentId(): string {
  return `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Mock provider reference format — mirrors expected AGR-{network}-{date}-{seq} pattern. */
export function generateReference(provider: PaymentProvider): string {
  const prefix =
    provider === PaymentProvider.MTN_MOMO
      ? 'MTN'
      : provider === PaymentProvider.VODAFONE_CASH
        ? 'VOD'
        : 'ATL';
  return `AGR-${prefix}-${format(new Date(), 'yyyyMMdd')}-${Math.floor(1000 + Math.random() * 9000)}`;
}
