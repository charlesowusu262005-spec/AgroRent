/**
 * @file        review.types.ts
 * @feature     Reviews
 * @description Domain types for equipment/worker reviews and submission payloads.
 * @data        Review, ReviewTargetType, SubmitReviewPayload, reviewTargetKey
 * @author      MiStarStudio
 */

/** Whether the review targets an equipment listing or a labor worker profile. */
export type ReviewTargetType = 'EQUIPMENT' | 'WORKER';

/** A single user-submitted review tied to equipment or a worker. */
export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  targetId: string;
  targetType: ReviewTargetType;
  rating: number;
  comment: string;
  createdAt: string;
}

/** Fields required when posting a new review via the API. */
export interface SubmitReviewPayload {
  targetId: string;
  targetType: ReviewTargetType;
  rating: number;
  comment: string;
}

/** Builds a stable cache key for grouping reviews by target in Redux. */
export function reviewTargetKey(targetId: string, targetType: ReviewTargetType): string {
  return `${targetType}:${targetId}`;
}
