/**
 * @file        OTPInput.tsx
 * @feature     Auth
 * @description Six-digit OTP entry with auto-advance, paste support, and backspace focus — used on phone verification screens.
 * @data        Controlled string value from parent; eventual POST /auth/verify-otp payload field
 * @consumes    react, react-native
 * @author      MiStarStudio
 */

import { useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInput as TextInputType } from 'react-native';

/** Props for the segmented OTP input used on OTPVerificationScreen. */
export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  length?: number; // Defaults to 6 — Ghana SMS OTP standard
}

/**
 * Renders one TextInput per digit with shared value state.
 * Handles multi-digit paste and backspace-to-previous-box for faster entry on feature phones.
 */
export function OTPInput({ value, onChange, error, length = 6 }: OTPInputProps) {
  const inputsRef = useRef<Array<TextInputType | null>>([]);
  // Pad with spaces so empty slots render as blank boxes while keeping fixed length
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const updateValue = (nextDigits: string[]) => {
    onChange(nextDigits.join('').replace(/\s/g, '').slice(0, length));
  };

  const handleChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, '');

    // Paste or autofill may deliver all digits at once
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, length);
      const next = Array.from({ length }, (_, i) => pasted[i] ?? '');
      updateValue(next);
      const focusIndex = Math.min(pasted.length, length - 1);
      inputsRef.current[focusIndex]?.focus();
      return;
    }

    const next = [...digits.map((d) => (d === ' ' ? '' : d))];
    next[index] = cleaned;
    updateValue(next);

    if (cleaned && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Move focus back when deleting an empty cell — common mobile OTP UX pattern
    if (key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const borderClass = error ? 'border-danger' : 'border-gray-300';

  return (
    <View className="w-full">
      <View className="flex-row justify-between gap-2">
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputsRef.current[index] = ref;
            }}
            value={digit.trim()}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={length}
            selectTextOnFocus
            accessibilityLabel={`OTP digit ${index + 1}`}
            className={`h-14 w-12 rounded-xl border bg-surface text-center text-xl font-semibold text-text-primary ${borderClass}`}
          />
        ))}
      </View>
      {error ? (
        <Text className="mt-2 text-center text-sm text-danger" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
