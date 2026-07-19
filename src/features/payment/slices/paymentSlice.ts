/**
 * @file        paymentSlice.ts
 * @feature     Payment
 * @description Redux state for MoMo initiation, status polling, and transaction history.
 * @data        PaymentState, initiatePayment, pollPaymentStatus, fetchTransactions, fetchReceipt
 * @consumes    mockPaymentData
 * @author      MiStarStudio
 */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  MOCK_TRANSACTIONS,
  generatePaymentId,
  generateReference,
} from '../data/mockPaymentData';
import {
  PaymentStatus,
  type InitiatePaymentPayload,
  type Payment,
} from '../types/payment.types';

/** Payment feature slice shape stored under `state.payment`. */
export interface PaymentState {
  currentPayment: Payment | null;
  transactionHistory: Payment[];
  isPolling: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Initial state ───────────────────────────────────────────────────────────

const initialState: PaymentState = {
  currentPayment: null,
  transactionHistory: MOCK_TRANSACTIONS,
  isPolling: false,
  isLoading: false,
  error: null,
};

// ─── Async thunks ────────────────────────────────────────────────────────────

/** Triggers a MoMo charge prompt on the farmer's phone for the given booking amount. */
export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async (payload: InitiatePaymentPayload, { rejectWithValue }) => {
    try {
      // TODO(api): replace with POST /payments/initiate { bookingId, provider, phoneNumber }
      await new Promise((resolve) => setTimeout(resolve, 500));

      const payment: Payment = {
        id: generatePaymentId(),
        bookingId: payload.bookingId,
        amount: payload.amount,
        currency: 'GHS',
        provider: payload.provider,
        providerReference: generateReference(payload.provider),
        phoneNumber: payload.phoneNumber,
        status: PaymentStatus.PENDING,
        equipmentName: payload.equipmentName,
        initiatedAt: Date.now(),
        returnFlow: payload.returnFlow,
      };

      return payment;
    } catch {
      return rejectWithValue('Failed to initiate payment');
    }
  },
);

/** Polls gateway status — mock auto-succeeds after 6 seconds to simulate MoMo approval. */
export const pollPaymentStatus = createAsyncThunk(
  'payment/pollPaymentStatus',
  async (paymentId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /payments/{id}/status (polled every 3s until SUCCESS/FAILED)
      await new Promise((resolve) => setTimeout(resolve, 300));

      const state = getState() as { payment: PaymentState };
      const payment =
        state.payment.currentPayment?.id === paymentId
          ? state.payment.currentPayment
          : state.payment.transactionHistory.find((p) => p.id === paymentId);

      if (!payment) return rejectWithValue('Payment not found');

      const elapsed = Date.now() - payment.initiatedAt;

      if (elapsed >= 6000) {
        return {
          ...payment,
          status: PaymentStatus.SUCCESS,
          paidAt: new Date().toISOString(),
          receiptUrl: `https://agrorent.gh/receipts/${payment.id}`,
        };
      }

      return { ...payment, status: PaymentStatus.PENDING };
    } catch {
      return rejectWithValue('Failed to check payment status');
    }
  },
);

/** Loads full transaction history — filter applied client-side until API supports query params. */
export const fetchTransactions = createAsyncThunk(
  'payment/fetchTransactions',
  async (_statusFilter: PaymentStatus | 'ALL' | undefined, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /payments/transactions
      await new Promise((resolve) => setTimeout(resolve, 500));

      const state = getState() as { payment: PaymentState };
      return state.payment.transactionHistory;
    } catch {
      return rejectWithValue('Failed to load transactions');
    }
  },
);

/** Fetches receipt detail for share/download — currently returns in-memory payment record. */
export const fetchReceipt = createAsyncThunk(
  'payment/fetchReceipt',
  async (paymentId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /payments/{id}/receipt
      await new Promise((resolve) => setTimeout(resolve, 300));

      const state = getState() as { payment: PaymentState };
      const payment =
        state.payment.transactionHistory.find((p) => p.id === paymentId) ??
        (state.payment.currentPayment?.id === paymentId
          ? state.payment.currentPayment
          : null);

      if (!payment) return rejectWithValue('Receipt not found');
      return payment;
    } catch {
      return rejectWithValue('Failed to load receipt');
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
      state.isPolling = false;
    },
    markPaymentFailed: (state, action: PayloadAction<string>) => {
      if (state.currentPayment) {
        state.currentPayment = {
          ...state.currentPayment,
          status: PaymentStatus.FAILED,
          failureReason: action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPayment = action.payload;
        state.isPolling = true;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Payment initiation failed';
      })
      .addCase(pollPaymentStatus.pending, (state) => {
        state.isPolling = true;
      })
      .addCase(pollPaymentStatus.fulfilled, (state, action) => {
        state.isPolling = action.payload.status === PaymentStatus.PENDING;
        if (state.currentPayment?.id === action.payload.id) {
          state.currentPayment = action.payload;
        }
        const index = state.transactionHistory.findIndex((p) => p.id === action.payload.id);
        if (action.payload.status === PaymentStatus.SUCCESS) {
          if (index >= 0) {
            state.transactionHistory[index] = action.payload;
          } else {
            state.transactionHistory = [action.payload, ...state.transactionHistory];
          }
        }
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionHistory = action.payload;
      });
  },
});

export const { clearCurrentPayment, markPaymentFailed } = paymentSlice.actions;
export default paymentSlice.reducer;
