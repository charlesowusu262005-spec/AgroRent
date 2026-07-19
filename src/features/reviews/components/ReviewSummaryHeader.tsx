/**
 * @file        ReviewSummaryHeader.tsx
 * @feature     Reviews
 * @description Aggregate rating display with star distribution bars for a review collection.
 * @consumes    StarRating
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';

import { StarRating } from '../../../components';
import type { Review } from '../types/review.types';

/** Props for the average-rating and per-star breakdown panel. */
export interface ReviewSummaryHeaderProps {
  reviews: Review[];
}

function getStarDistribution(reviews: Review[]): Record<number, number> {
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    const star = Math.min(5, Math.max(1, Math.round(review.rating)));
    counts[star] += 1;
  });
  return counts;
}

/** Renders average score, star rating, total count, and 1–5 star percentage bars. */
export function ReviewSummaryHeader({ reviews }: ReviewSummaryHeaderProps) {
  if (reviews.length === 0) {
    return null;
  }

  const total = reviews.length;
  const average =
    Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / total) * 10) / 10;
  const distribution = getStarDistribution(reviews);

  return (
    <View className="mb-4 rounded-2xl bg-gray-50 p-4">
      <View className="flex-row items-center">
        <Text className="text-4xl font-bold text-text-primary">{average.toFixed(1)}</Text>
        <View className="ml-4 flex-1">
          <StarRating rating={average} size={18} />
          <Text className="mt-1 text-sm text-text-secondary">
            {total} review{total === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      <View className="mt-4 gap-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star];
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <View key={star} className="flex-row items-center">
              <Text className="w-4 text-xs text-text-secondary">{star}</Text>
              <View className="mx-2 h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <View
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${percent}%` }}
                />
              </View>
              <Text className="w-8 text-right text-xs text-text-muted">{percent}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
