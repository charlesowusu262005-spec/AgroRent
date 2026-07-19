/**
 * @file        reviewSlice.ts
 * @feature     Reviews
 * @description Redux state for reviews grouped by target (equipment or worker) with fetch and submit thunks.
 * @data        ReviewState, fetchReviews, submitReview, selectReviewsForTarget
 * @consumes    mockReviewData
 * @author      MiStarStudio
 */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../../app/store';
import { generateReviewId, getMockReviews, MOCK_REVIEWS_BY_TARGET } from '../data/mockReviewData';
import type { Review, ReviewTargetType, SubmitReviewPayload } from '../types/review.types';
import { reviewTargetKey } from '../types/review.types';

/** Reviews feature slice shape stored under `state.review`. */
export interface ReviewState {
  reviewsByTarget: Record<string, Review[]>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  lastSubmittedTargetKey: string | null;
}

const initialState: ReviewState = {
  // TODO(api): start empty; hydrate via fetchReviews from GET /reviews
  reviewsByTarget: MOCK_REVIEWS_BY_TARGET,
  isLoading: false,
  isSubmitting: false,
  error: null,
  lastSubmittedTargetKey: null,
};

export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (
    { targetId, targetType }: { targetId: string; targetType: ReviewTargetType },
    { rejectWithValue },
  ) => {
    try {
      // TODO(api): replace with GET /reviews?targetId=&targetType=
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        targetKey: reviewTargetKey(targetId, targetType),
        reviews: getMockReviews(targetId, targetType),
      };
    } catch {
      return rejectWithValue('Failed to load reviews');
    }
  },
);

export const submitReview = createAsyncThunk(
  'review/submitReview',
  async (
    payload: SubmitReviewPayload & {
      reviewerId: string;
      reviewerName: string;
      reviewerAvatar?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      // TODO(api): replace with POST /reviews { targetId, targetType, rating, comment }
      await new Promise((resolve) => setTimeout(resolve, 600));

      const review: Review = {
        id: generateReviewId(),
        reviewerId: payload.reviewerId,
        reviewerName: payload.reviewerName,
        reviewerAvatar: payload.reviewerAvatar,
        targetId: payload.targetId,
        targetType: payload.targetType,
        rating: payload.rating,
        comment: payload.comment.trim(),
        createdAt: new Date().toISOString(),
      };

      return {
        targetKey: reviewTargetKey(payload.targetId, payload.targetType),
        review,
      };
    } catch {
      return rejectWithValue('Failed to submit review');
    }
  },
);

export const selectReviewsForTarget = (
  state: RootState,
  targetId: string,
  targetType: ReviewTargetType,
): Review[] => state.review.reviewsByTarget[reviewTargetKey(targetId, targetType)] ?? [];

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearLastSubmitted: (state) => {
      state.lastSubmittedTargetKey = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviewsByTarget[action.payload.targetKey] = action.payload.reviews;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to load reviews';
      })
      .addCase(submitReview.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { targetKey, review } = action.payload;
        const existing = state.reviewsByTarget[targetKey] ?? [];
        state.reviewsByTarget[targetKey] = [review, ...existing];
        state.lastSubmittedTargetKey = targetKey;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Failed to submit review';
      });
  },
});

export const { clearReviewError, clearLastSubmitted } = reviewSlice.actions;

export default reviewSlice.reducer;
