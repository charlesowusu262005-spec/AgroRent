/**
 * @file        ReviewCard.tsx
 * @feature     Reviews
 * @description Single review row with reviewer avatar, stars, relative date, and comment text.
 * @consumes    Avatar, StarRating
 * @author      MiStarStudio
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

import { Avatar, StarRating } from '../../../components';
import type { Review } from '../types/review.types';

/** Props for one review entry in a list. */
export interface ReviewCardProps {
  review: Review;
}

/** Displays reviewer identity, star rating, time-ago label, and comment body. */
function ReviewCardComponent({ review }: ReviewCardProps) {
  const relativeDate = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });

  return (
    <View className="rounded-xl border border-gray-100 bg-surface p-4">
      <View className="flex-row items-center">
        <Avatar name={review.reviewerName} imageUrl={review.reviewerAvatar} size="sm" />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold text-text-primary">{review.reviewerName}</Text>
          <View className="mt-1 flex-row items-center">
            <StarRating rating={review.rating} size={14} />
            <Text className="ml-2 text-xs text-text-muted">{relativeDate}</Text>
          </View>
        </View>
      </View>
      <Text className="mt-3 text-sm leading-5 text-text-secondary">{review.comment}</Text>
    </View>
  );
}

export const ReviewCard = memo(ReviewCardComponent);
