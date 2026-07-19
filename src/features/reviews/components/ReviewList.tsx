/**
 * @file        ReviewList.tsx
 * @feature     Reviews
 * @description Fetches and displays reviews for a single equipment or worker target with summary header.
 * @data        fetchReviews, selectReviewsForTarget
 * @consumes    ReviewCard, ReviewSummaryHeader, LoadingSpinner
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { LoadingSpinner } from '../../../components';
import { fetchReviews, selectReviewsForTarget } from '../slices/reviewSlice';
import type { ReviewTargetType } from '../types/review.types';
import { ReviewCard } from './ReviewCard';
import { ReviewSummaryHeader } from './ReviewSummaryHeader';

/** Props identifying which target's reviews to load and display. */
export interface ReviewListProps {
  targetId: string;
  targetType: ReviewTargetType;
  emptyMessage?: string;
}

/** Loads reviews on mount and renders summary plus a non-scrollable card list. */
export function ReviewList({
  targetId,
  targetType,
  emptyMessage = 'No reviews yet',
}: ReviewListProps) {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) => selectReviewsForTarget(state, targetId, targetType));
  const isLoading = useAppSelector((state) => state.review.isLoading);

  useEffect(() => {
    void dispatch(fetchReviews({ targetId, targetType }));
  }, [dispatch, targetId, targetType]);

  if (isLoading && reviews.length === 0) {
    return <LoadingSpinner label="Loading reviews..." />;
  }

  if (reviews.length === 0) {
    return <Text className="text-sm text-text-muted">{emptyMessage}</Text>;
  }

  return (
    <View>
      <ReviewSummaryHeader reviews={reviews} />
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => <ReviewCard review={item} />}
      />
    </View>
  );
}
