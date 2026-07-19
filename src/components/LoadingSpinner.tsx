/**
 * @file        LoadingSpinner.tsx
 * @feature     Design System
 * @description Full-area or inline loading indicator while Redux thunks fetch data.
 * @data        Presentational only.
 * @consumes    AgroRent primary green (#1A6B3A) for spinner colour
 * @author      MiStarStudio
 */

import { ActivityIndicator, Text, View } from 'react-native';

/** Props for the shared loading spinner. */
export interface LoadingSpinnerProps {
  label?: string;
  size?: 'small' | 'large';
  accessibilityLabel?: string;
}

/** Branded spinner with optional caption for screen-reader context. */
export function LoadingSpinner({
  label,
  size = 'large',
  accessibilityLabel,
}: LoadingSpinnerProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Loading'}
      className="flex-1 items-center justify-center py-8"
    >
      <ActivityIndicator size={size} color="#1A6B3A" />
      {label ? (
        <Text className="mt-3 text-base text-text-secondary">{label}</Text>
      ) : null}
    </View>
  );
}
