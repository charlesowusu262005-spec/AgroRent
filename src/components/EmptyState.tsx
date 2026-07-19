/**
 * @file        EmptyState.tsx
 * @feature     Design System
 * @description Friendly placeholder when a list or search returns no results.
 * @data        Presentational — copy supplied by parent screen.
 * @consumes    Button
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { Button } from './Button';

/** Props for empty list / search states. */
export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  accessibilityLabel?: string;
}

/**
 * Centred empty view with optional recovery action (e.g. "Clear filters").
 * Prevents blank screens that confuse users on first launch.
 */
export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  accessibilityLabel,
}: EmptyStateProps) {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? title}
      className="items-center justify-center px-6 py-12"
    >
      <View className="mb-4 items-center justify-center rounded-full bg-gray-100 p-4">
        {icon}
      </View>
      <Text className="mb-2 text-center text-lg font-semibold text-text-primary">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mb-6 text-center text-base text-text-secondary">
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}
