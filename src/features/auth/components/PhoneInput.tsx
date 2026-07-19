/**
 * @file        PhoneInput.tsx
 * @feature     Auth
 * @description Ghana phone field with fixed +233 prefix and digit-only input — primary login identifier in the local market.
 * @data        Local form string (9–10 digits); sent to POST /auth/login, /auth/register, /auth/forgot-password
 * @consumes    validation.stripPhoneDigits
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { stripPhoneDigits } from '../utils/validation';

/** Props for the Ghana-localised phone number input shared across auth screens. */
export interface PhoneInputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  accessibilityLabel?: string;
}

/**
 * Displays +233 prefix and caps input at 10 digits to accept both
 * 024… (10-digit local) and 24… (9-digit without leading zero) formats.
 */
export function PhoneInput({
  label = 'Phone Number',
  value,
  onChangeText,
  error,
  accessibilityLabel,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderClass = error
    ? 'border-danger'
    : isFocused
      ? 'border-primary'
      : 'border-gray-300';

  const handleChange = (text: string) => {
    const digits = stripPhoneDigits(text).slice(0, 10);
    onChangeText(digits);
  };

  return (
    <View className="w-full">
      <Text className="mb-1.5 text-sm font-medium text-text-primary">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl border bg-surface px-3 ${borderClass}`}
      >
        <Text className="mr-2 border-r border-gray-200 pr-2 text-base font-medium text-text-secondary">
          +233
        </Text>
        <TextInput
          value={value}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="24 123 4567"
          placeholderTextColor="#9CA3AF"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 py-3.5 text-base text-text-primary"
        />
      </View>
      {error ? (
        <Text className="mt-1.5 text-sm text-danger" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
