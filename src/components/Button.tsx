/**
 * @file        Button.tsx
 * @feature     Design System
 * @description Primary pressable control for all CTAs; centralises variant styles so screens stay consistent.
 * @data        Presentational only — no remote data.
 * @consumes    NativeWind theme tokens (primary, danger)
 * @author      MiStarStudio
 */

import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';

/** Visual style preset for buttons across the app. */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/** Props for the shared Button component. */
export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** When true, shows spinner and blocks duplicate taps. */
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary active:bg-primary/90',
    text: 'text-white',
  },
  secondary: {
    container: 'border border-primary bg-transparent active:bg-primary/5',
    text: 'text-primary',
  },
  danger: {
    container: 'bg-danger active:bg-danger/90',
    text: 'text-white',
  },
  ghost: {
    container: 'bg-transparent active:bg-gray-100',
    text: 'text-text-primary',
  },
};

/**
 * Renders a labelled button with loading and accessibility support.
 * Spinner colour inverts on light variants so it remains visible on white backgrounds.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const styles = variantClasses[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`flex-row items-center justify-center rounded-xl px-5 py-3.5 ${styles.container} ${
        fullWidth ? 'w-full' : ''
      } ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' || variant === 'ghost' ? '#1A6B3A' : '#FFFFFF'}
          accessibilityLabel="Loading"
        />
      ) : (
        <View className="flex-row items-center">
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={`text-base font-semibold ${styles.text}`}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}
