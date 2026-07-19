/**
 * @file        Snackbar.tsx
 * @feature     Reviews
 * @description Auto-dismissing bottom toast used after successful review submission.
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import { Text, View } from 'react-native';

/** Props for a timed overlay message with optional dismiss callback. */
export interface SnackbarProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  durationMs?: number;
}

/** Shows a primary-colored banner that auto-dismisses after `durationMs`. */
export function Snackbar({
  message,
  visible,
  onDismiss,
  durationMs = 2500,
}: SnackbarProps) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onDismiss?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [visible, durationMs, onDismiss]);

  if (!visible) return null;

  return (
    <View className="absolute bottom-6 left-4 right-4 z-50 rounded-xl bg-primary px-4 py-3 shadow-lg">
      <Text className="text-center text-sm font-semibold text-white">{message}</Text>
    </View>
  );
}
