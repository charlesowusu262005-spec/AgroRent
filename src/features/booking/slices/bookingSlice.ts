/**
 * @file        bookingSlice.ts
 * @feature     Booking
 * @description Redux state for booking drafts, history, and owner/farmer lifecycle actions.
 * @data        BookingState, fetchBookings, createBooking, confirmBooking, rejectBooking, cancelBooking, completeBooking
 * @consumes    mockBookingData, cache/storage
 * @author      MiStarStudio
 */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { CACHE_KEYS, saveJson } from '../../../services/cache/storage';
import { MOCK_BOOKINGS, generateBookingId } from '../data/mockBookingData';
import {
  BookingStatus,
  PaymentStatus,
  type Booking,
  type BookingDraft,
} from '../types/booking.types';

/** Booking feature slice shape stored under `state.booking`. */
export interface BookingState {
  bookingDraft: BookingDraft | null;
  bookingHistory: Booking[];
  activeBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Initial state ───────────────────────────────────────────────────────────

const initialState: BookingState = {
  bookingDraft: null,
  bookingHistory: MOCK_BOOKINGS,
  activeBooking: null,
  isLoading: false,
  error: null,
};

// ─── Async thunks ────────────────────────────────────────────────────────────

/** Loads role-filtered booking list — farmers see their rentals, owners see incoming requests. */
export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (
    { role, userId }: { role: 'FARMER' | 'OWNER' | 'WORKER'; userId?: string },
    { getState, rejectWithValue },
  ) => {
    try {
      // TODO(api): replace with GET /bookings (role-aware)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const state = getState() as { booking: BookingState };
      let results = state.booking.bookingHistory;

      if (role === 'FARMER' && userId) {
        results = results.filter((b) => b.farmerId === userId || b.farmerName === 'Demo User');
      } else if (role === 'OWNER' && userId) {
        results = results.filter((b) => b.ownerId === userId);
      } else if (role === 'OWNER') {
        results = results.filter((b) => b.ownerId === 'owner-1');
      }

      return results;
    } catch {
      return rejectWithValue('Failed to load bookings');
    }
  },
);

/** Submits a new rental request after payment step; status starts as PENDING. */
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (
    {
      draft,
      farmerId,
      farmerName,
    }: { draft: BookingDraft; farmerId: string; farmerName: string },
    { rejectWithValue },
  ) => {
    try {
      // TODO(api): replace with POST /bookings
      await new Promise((resolve) => setTimeout(resolve, 600));

      const booking: Booking = {
        id: generateBookingId(),
        equipmentId: draft.equipmentId,
        equipmentName: draft.equipmentName,
        equipmentImage: draft.equipmentImage,
        farmerId,
        farmerName,
        ownerId: draft.ownerId,
        ownerName: draft.ownerName,
        startDate: draft.startDate,
        endDate: draft.endDate,
        totalDays: draft.totalDays,
        totalCost: draft.totalCost,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        notes: draft.notes,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      return booking;
    } catch {
      return rejectWithValue('Failed to create booking');
    }
  },
);

/** Owner accepts a pending rental request. */
export const confirmBooking = createAsyncThunk(
  'booking/confirmBooking',
  async (bookingId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /bookings/{id}/confirm
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { booking: BookingState };
      const booking = state.booking.bookingHistory.find((b) => b.id === bookingId);
      if (!booking) return rejectWithValue('Booking not found');
      return { ...booking, status: BookingStatus.CONFIRMED };
    } catch {
      return rejectWithValue('Failed to confirm booking');
    }
  },
);

/** Owner rejects a pending request with an optional reason shown to the farmer. */
export const rejectBooking = createAsyncThunk(
  'booking/rejectBooking',
  async (
    { bookingId, reason }: { bookingId: string; reason: string },
    { getState, rejectWithValue },
  ) => {
    try {
      // TODO(api): replace with PUT /bookings/{id}/reject
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { booking: BookingState };
      const booking = state.booking.bookingHistory.find((b) => b.id === bookingId);
      if (!booking) return rejectWithValue('Booking not found');
      return {
        ...booking,
        status: BookingStatus.REJECTED,
        rejectReason: reason,
      };
    } catch {
      return rejectWithValue('Failed to reject booking');
    }
  },
);

/** Farmer or system cancels; paid bookings transition payment status to REFUNDED. */
export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (bookingId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /bookings/{id}/cancel
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { booking: BookingState };
      const booking = state.booking.bookingHistory.find((b) => b.id === bookingId);
      if (!booking) return rejectWithValue('Booking not found');
      return {
        ...booking,
        status: BookingStatus.CANCELLED,
        paymentStatus:
          booking.paymentStatus === PaymentStatus.PAID
            ? PaymentStatus.REFUNDED
            : booking.paymentStatus,
      };
    } catch {
      return rejectWithValue('Failed to cancel booking');
    }
  },
);

/** Marks an active rental as completed after equipment is returned. */
export const completeBooking = createAsyncThunk(
  'booking/completeBooking',
  async (bookingId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /bookings/{id}/complete
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { booking: BookingState };
      const booking = state.booking.bookingHistory.find((b) => b.id === bookingId);
      if (!booking) return rejectWithValue('Booking not found');
      return { ...booking, status: BookingStatus.COMPLETED };
    } catch {
      return rejectWithValue('Failed to complete booking');
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDraft: (state, action: PayloadAction<BookingDraft | null>) => {
      state.bookingDraft = action.payload;
    },
    setActiveBooking: (state, action: PayloadAction<Booking | null>) => {
      state.activeBooking = action.payload;
    },
    updateDraftPaymentStatus: (state) => {
      if (state.bookingDraft) {
        state.bookingDraft.paymentCompleted = true;
      }
    },
    /** Hydrates history from offline cache without overwriting newer in-memory entries. */
    setBookingHistoryFromCache: (state, action: PayloadAction<Booking[]>) => {
      if (state.bookingHistory.length <= MOCK_BOOKINGS.length) {
        state.bookingHistory = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookingHistory = action.payload;
        void saveJson(CACHE_KEYS.BOOKING_HISTORY, action.payload);
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to load bookings';
      })
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookingHistory = [action.payload, ...state.bookingHistory];
        state.activeBooking = action.payload;
        state.bookingDraft = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to create booking';
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.bookingHistory = state.bookingHistory.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        );
        if (state.activeBooking?.id === action.payload.id) {
          state.activeBooking = action.payload;
        }
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        state.bookingHistory = state.bookingHistory.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        );
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookingHistory = state.bookingHistory.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        );
        if (state.activeBooking?.id === action.payload.id) {
          state.activeBooking = action.payload;
        }
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        state.bookingHistory = state.bookingHistory.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        );
      });
  },
});

export const { setBookingDraft, setActiveBooking, updateDraftPaymentStatus, setBookingHistoryFromCache } =
  bookingSlice.actions;

export default bookingSlice.reducer;
