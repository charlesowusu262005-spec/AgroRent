/**
 * @file        ScreenContainer.tsx
 * @feature     Design System
 * @description Standard screen wrapper with safe areas, optional scroll, and consistent horizontal padding.
 * @data        Presentational only.
 * @consumes    react-native-safe-area-context SafeAreaView
 * @author      MiStarStudio
 */

import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

/** Props for the shared screen layout shell. */
export interface ScreenContainerProps {
  children: ReactNode;
  /** Enables ScrollView with keyboard-friendly tap handling for long forms. */
  scrollable?: boolean;
  header?: ReactNode;
  className?: string;
  accessibilityLabel?: string;
}

/**
 * Wraps every feature screen so notch/status-bar insets and background colour match.
 * `keyboardShouldPersistTaps` keeps buttons tappable while the keyboard is open.
 */
export function ScreenContainer({
  children,
  scrollable = false,
  header,
  className = '',
  accessibilityLabel,
}: ScreenContainerProps) {
  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="grow pb-6"
      className="flex-1"
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1">{children}</View>
  );

  return (
    <SafeAreaView
      accessibilityLabel={accessibilityLabel}
      className={`flex-1 bg-background ${className}`}
    >
      {header ? <View className="px-4 pb-2">{header}</View> : null}
      <View className="flex-1 px-4">{content}</View>
    </SafeAreaView>
  );
}
