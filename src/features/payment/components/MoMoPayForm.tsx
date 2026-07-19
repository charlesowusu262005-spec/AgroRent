/**
 * @file        MoMoPayForm.tsx
 * @feature     Payment
 * @description Phone input with +233 prefix and provider-specific validation on blur.
 * @data        PaymentProvider
 * @consumes    phoneValidation.validateMoMoPhone
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { PaymentProvider } from '../types/payment.types';
import { validateMoMoPhone } from '../utils/phoneValidation';

/** Controlled MoMo phone field — validation deferred to blur to avoid noisy inline errors. */
export interface MoMoPayFormProps {
  provider: PaymentProvider;
  phone: string;
  onChangePhone: (phone: string) => void;
  defaultPhone?: string;
}

/** Ghana mobile number entry with live digit stripping and provider prefix check. */
export function MoMoPayForm({
  provider,
  phone,
  onChangePhone,
  defaultPhone,
}: MoMoPayFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    onChangePhone(digits);
    if (error) setError(undefined);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setError(validateMoMoPhone(phone || defaultPhone || '', provider));
  };

  const displayPhone = phone || defaultPhone || '';
  const borderClass = error ? 'border-danger' : isFocused ? 'border-primary' : 'border-gray-300';

  return (
    <View className="w-full">
      <Text className="mb-1.5 text-sm font-medium text-text-primary">MoMo phone number</Text>
      <View
        className={`flex-row items-center rounded-xl border bg-surface px-3 ${borderClass}`}
      >
        <Text className="mr-2 border-r border-gray-200 pr-2 text-base font-medium text-text-secondary">
          +233
        </Text>
        <TextInput
          value={displayPhone}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="24 123 4567"
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          accessibilityLabel="Mobile money phone number"
          className="flex-1 py-3.5 text-base text-text-primary"
        />
      </View>
      {error ? (
        <Text className="mt-1.5 text-sm text-danger" accessibilityRole="alert">
          {error}
        </Text>
      ) : (
        <Text className="mt-1.5 text-xs text-text-muted">
          Pre-filled from your profile. Edit if paying from a different number.
        </Text>
      )}
    </View>
  );
}

/** Imperative validation helper for the pay button before dispatching initiatePayment. */
export function getMoMoPhoneError(phone: string, provider: PaymentProvider): string | undefined {
  return validateMoMoPhone(phone, provider);
}
