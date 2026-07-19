/**
 * @file        Input.tsx
 * @feature     Design System
 * @description Labelled text field with focus and error states for forms across auth, booking, and profile.
 * @data        Presentational only — value controlled by parent screen.
 * @consumes    NativeWind border colour tokens
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { ReactNode } from 'react';
import type { TextInputProps } from 'react-native';

/** Extends RN TextInput with label, error display, and optional leading icon. */
export interface InputProps extends Omit<TextInputProps, 'className'> {
  label: string;
  error?: string;
  leftIcon?: ReactNode;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
}

/**
 * Controlled input with visual feedback for validation errors and focus.
 * Error text is exposed to screen readers via `accessibilityRole="alert"`.
 */
export function Input({
  label,
  error,
  leftIcon,
  secureTextEntry = false,
  accessibilityLabel,
  onFocus,
  onBlur,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderClass = error
    ? 'border-danger'
    : isFocused
      ? 'border-primary'
      : 'border-gray-300';

  return (
    <View className="w-full">
      <Text
        className="mb-1.5 text-sm font-medium text-text-primary"
        accessibilityRole="text"
      >
        {label}
      </Text>
      <View
        className={`flex-row items-center rounded-xl border bg-surface px-3 ${borderClass}`}
      >
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
        <TextInput
          {...textInputProps}
          secureTextEntry={secureTextEntry}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor="#9CA3AF"
          className="flex-1 py-3.5 text-base text-text-primary"
        />
      </View>
      {error ? (
        <Text
          className="mt-1.5 text-sm text-danger"
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
