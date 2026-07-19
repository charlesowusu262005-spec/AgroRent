/**
 * @file        StarRating.tsx
 * @feature     Design System
 * @description Star display for equipment/worker ratings; supports read-only and interactive review input.
 * @data        Presentational — `rating` from API aggregates (0.0–5.0).
 * @consumes    lucide-react-native Star icon
 * @author      MiStarStudio
 */

import { Pressable, View } from 'react-native';
import { Star } from 'lucide-react-native';

/** Props for read-only or interactive star rating. */
export interface StarRatingProps {
  /** Average or selected score; displayed with half-star rounding via Math.round. */
  rating: number;
  maxRating?: number;
  /** When true, stars become tappable for review submission. */
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: number;
  accessibilityLabel?: string;
}

/**
 * Renders filled/empty stars; interactive mode used on SubmitReviewScreen.
 * Rounds display rating so 4.6 still shows five filled stars when closer to 5.
 */
export function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  onRatingChange,
  size = 20,
  accessibilityLabel,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1);

  const renderStar = (starValue: number) => {
    const isFilled = starValue <= Math.round(rating);

    const starIcon = (
      <Star
        size={size}
        color={isFilled ? '#F9A825' : '#D1D5DB'}
        fill={isFilled ? '#F9A825' : 'transparent'}
      />
    );

    if (interactive && onRatingChange) {
      return (
        <Pressable
          key={starValue}
          onPress={() => onRatingChange(starValue)}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${starValue} out of ${maxRating} stars`}
          hitSlop={4}
          className="p-0.5"
        >
          {starIcon}
        </Pressable>
      );
    }

    return (
      <View key={starValue} className="p-0.5">
        {starIcon}
      </View>
    );
  };

  return (
    <View
      accessibilityRole={interactive ? 'adjustable' : 'text'}
      accessibilityLabel={
        accessibilityLabel ?? `${rating} out of ${maxRating} stars`
      }
      className="flex-row items-center"
    >
      {stars.map(renderStar)}
    </View>
  );
}
