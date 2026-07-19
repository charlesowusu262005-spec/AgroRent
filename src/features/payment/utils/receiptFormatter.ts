/**
 * @file        receiptFormatter.ts
 * @feature     Payment
 * @description Plain-text receipt builder for share sheet and future PDF generation.
 * @data        Payment
 * @consumes    PROVIDER_LABELS
 * @author      MiStarStudio
 */

import { format, parseISO } from 'date-fns';

import { PROVIDER_LABELS } from '../data/mockPaymentData';
import type { Payment } from '../types/payment.types';

/** Builds a monospace-friendly receipt string for Share.share and SMS fallback. */
export function formatReceiptText(payment: Payment): string {
  const paidAt = payment.paidAt
    ? format(parseISO(payment.paidAt), 'dd MMM yyyy · HH:mm')
    : '—';

  return [
    'AGRORENT GHANA',
    'Payment Receipt',
    '────────────────────',
    `Reference: ${payment.providerReference}`,
    `Payment ID: ${payment.id}`,
    `Date: ${paidAt}`,
    `Booking: ${payment.bookingId}`,
    payment.equipmentName ? `Equipment: ${payment.equipmentName}` : null,
    `Amount: ${payment.currency} ${payment.amount.toFixed(2)}`,
    `Method: ${PROVIDER_LABELS[payment.provider]}`,
    `Phone: +233 ${payment.phoneNumber}`,
    `Status: ${payment.status}`,
    '────────────────────',
    'Thank you for using AgroRent Ghana',
  ]
    .filter(Boolean)
    .join('\n');
}
