/**
 * @file        Card.tsx
 * @feature     Design System
 * @description Elevated surface wrapper for grouped content; optionally tappable when used as a list row.
 * @data        Presentational only — children supply content.
 * @consumes    NativeWind surface + shadow tokens
 * @author      MiStarStudio
 */

import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';

/** Internal padding scale for card content. */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/** Props for the shared Card component. */
export interface CardProps {
  children: ReactNode;
  /** When set, the entire card becomes a pressable button. */
  onPress?: () => void;
  padding?: CardPadding;
  accessibilityLabel?: string;
}

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Renders a rounded surface; switches to Pressable when `onPress` is provided
 * so list items get a single accessible tap target.
 */
export function Card({
  children,
  onPress,
  padding = 'md',
  accessibilityLabel,
}: CardProps) {
  const className = `rounded-2xl bg-surface shadow-sm ${paddingClasses[padding]}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={`${className} active:opacity-90`}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View accessibilityRole="none" className={className}>
      {children}
    </View>
  );
}
