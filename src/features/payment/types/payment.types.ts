/**
 * @file        payment.types.ts
 * @feature     Payment
 * @description Domain types for Ghana Mobile Money payments, receipts, and display status mapping.
 * @data        PaymentProvider, PaymentStatus, Payment, InitiatePaymentPayload, PaymentDisplayStatus
 * @author      MiStarStudio
 */

/** Supported MoMo networks for Ghana — matches backend provider enum. */
export enum PaymentProvider {
  MTN_MOMO = 'MTN_MOMO',
  VODAFONE_CASH = 'VODAFONE_CASH',
  AIRTELTIGO = 'AIRTELTIGO',
}

/** Gateway settlement state returned by the payment provider webhook. */
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

/** Persisted payment record linked to a booking and MoMo transaction. */
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  providerReference: string;
  phoneNumber: string;
  status: PaymentStatus;
  receiptUrl?: string;
  paidAt?: string;
  failureReason?: string;
  equipmentName?: string;
  initiatedAt: number;
  /** Where to navigate after success — new booking flow vs existing booking receipt. */
  returnFlow: 'confirm' | 'receipt';
}

/** Payload sent when farmer initiates a MoMo charge from the payment screen. */
export interface InitiatePaymentPayload {
  bookingId: string;
  amount: number;
  provider: PaymentProvider;
  phoneNumber: string;
  equipmentName?: string;
  returnFlow: 'confirm' | 'receipt';
}

/** Simplified tri-state used by UI polling and status indicators. */
export type PaymentDisplayStatus = 'PROCESSING' | 'SUCCESS' | 'FAILED';

/** Collapses REVERSED into FAILED for farmer-facing status screens. */
export function toDisplayStatus(status: PaymentStatus): PaymentDisplayStatus {
  switch (status) {
    case PaymentStatus.SUCCESS:
      return 'SUCCESS';
    case PaymentStatus.FAILED:
    case PaymentStatus.REVERSED:
      return 'FAILED';
    case PaymentStatus.PENDING:
    default:
      return 'PROCESSING';
  }
}
