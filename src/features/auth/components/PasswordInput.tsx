/**
 * @file        PasswordInput.tsx
 * @feature     Auth
 * @description Password field with show/hide toggle and focus styling — reused on login, register, and reset flows.
 * @data        Local form string; sent to POST /auth/login, /auth/register, /auth/reset-password
 * @consumes    lucide-react-native
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

/** Props for the secure text input with visibility toggle. */
export interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
  accessibilityLabel?: string;
}

/** Masked password input — toggle reveals text for verification on small screens. */
export function PasswordInput({
  label = 'Password',
  value,
  onChangeText,
  error,
  placeholder = 'Enter your password',
  accessibilityLabel,
}: PasswordInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderClass = error
    ? 'border-danger'
    : isFocused
      ? 'border-primary'
      : 'border-gray-300';

  return (
    <View className="w-full">
      <Text className="mb-1.5 text-sm font-medium text-text-primary">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl border bg-surface px-3 ${borderClass}`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 py-3.5 text-base text-text-primary"
        />
        <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          hitSlop={8}
          className="ml-2 p-1"
        >
          {showPassword ? (
            <EyeOff size={20} color="#6B7280" />
          ) : (
            <Eye size={20} color="#6B7280" />
          )}
        </Pressable>
      </View>
      {error ? (
        <Text className="mt-1.5 text-sm text-danger" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
