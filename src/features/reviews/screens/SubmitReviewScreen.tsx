/**
 * @file        SubmitReviewScreen.tsx
 * @feature     Reviews
 * @description Star rating and comment form for equipment or worker targets after a completed booking/job.
 * @navigation  SubmitReview (modal/stack) — params: targetId, targetType, targetName
 * @data        submitReview thunk; auth user for reviewer identity
 * @consumes    StarRating, Button, Snackbar
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, StarRating, Snackbar } from '../../../components';
import { submitReview } from '../slices/reviewSlice';
import type { ReviewTargetType } from '../types/review.types';

const MAX_COMMENT_LENGTH = 500;

/** Route params identifying the review target (equipment listing or worker profile). */
export type SubmitReviewParams = {
  targetId: string;
  targetType: ReviewTargetType;
  targetName: string;
};

type Props = NativeStackScreenProps<{ SubmitReview: SubmitReviewParams }, 'SubmitReview'>;

/** Collects rating and comment, dispatches submitReview, then shows success snackbar and navigates back. */
export function SubmitReviewScreen({ navigation, route }: Props) {
  const { targetId, targetType, targetName } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isSubmitting = useAppSelector((state) => state.review.isSubmitting);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const remaining = MAX_COMMENT_LENGTH - comment.length;
  const canSubmit = rating > 0 && comment.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please select a star rating before submitting.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Comment required', 'Please share a few words about your experience.');
      return;
    }

    const result = await dispatch(
      submitReview({
        targetId,
        targetType,
        rating,
        comment,
        reviewerId: user?.id ?? 'demo-user',
        reviewerName: user?.name ?? 'Demo User',
      }),
    );

    if (submitReview.fulfilled.match(result)) {
      setShowSnackbar(true);
    } else {
      Alert.alert('Submission failed', 'Could not submit your review. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" accessibilityLabel="Submit review">
      <View className="relative flex-1">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="pb-6"
        >
          <Text className="mb-1 pt-2 text-2xl font-bold text-text-primary">Review</Text>
          <Text className="mb-6 text-base text-text-secondary">{targetName}</Text>

          <Text className="mb-3 text-sm font-semibold text-text-primary">Your rating</Text>
          <View className="mb-6 items-center rounded-2xl bg-gray-50 py-6">
            <StarRating rating={rating} interactive onRatingChange={setRating} size={36} />
            <Text className="mt-3 text-sm text-text-secondary">
              {rating > 0 ? `${rating} out of 5 stars` : 'Tap a star to rate'}
            </Text>
          </View>

          <Text className="mb-2 text-sm font-semibold text-text-primary">Your review</Text>
          <TextInput
            value={comment}
            onChangeText={(text) => setComment(text.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="Share details about your experience..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="min-h-[140px] rounded-xl border border-gray-200 bg-surface px-4 py-3 text-base text-text-primary"
          />
          <Text
            className={`mt-2 text-right text-xs ${
              remaining < 50 ? 'text-danger' : 'text-text-muted'
            }`}
          >
            {remaining} characters remaining
          </Text>

          <View className="mt-8">
            <Button
              label="Submit Review"
              onPress={() => void handleSubmit()}
              disabled={!canSubmit}
              loading={isSubmitting}
              fullWidth
            />
          </View>
        </ScrollView>

        <Snackbar
          message="Review submitted successfully!"
          visible={showSnackbar}
          onDismiss={() => {
            setShowSnackbar(false);
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
