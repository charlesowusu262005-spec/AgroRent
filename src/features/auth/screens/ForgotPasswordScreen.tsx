/**
 * @file        ForgotPasswordScreen.tsx
 * @feature     Auth
 * @description Collects phone number to initiate password reset via SMS OTP.
 * @data        POST /auth/forgot-password (mocked)
 * @navigation  ForgotPassword → OTPVerification (purpose: reset)
 * @consumes    PhoneInput, ScreenContainer, validation
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, ScreenContainer } from '../../../components';
import { PhoneInput } from '../components';
import { isValidGhanaPhone } from '../utils/validation';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!isValidGhanaPhone(phone)) {
      setError('Enter a valid 9–10 digit Ghana phone number');
      return;
    }

    setLoading(true);
    try {
      // TODO(api): replace with POST /auth/forgot-password
      await new Promise((resolve) => setTimeout(resolve, 600));

      navigation.navigate('OTPVerification', {
        phone,
        purpose: 'reset',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Forgot password screen">
      <View className="py-6">
        <Text className="text-2xl font-bold text-text-primary">Forgot password?</Text>
        <Text className="mt-2 text-base text-text-secondary">
          Enter your phone number and we&apos;ll send you a reset code
        </Text>

        <View className="mt-8">
          <PhoneInput
            value={phone}
            onChangeText={(value) => {
              setPhone(value);
              if (error) setError(undefined);
            }}
            error={error}
          />
        </View>

        <View className="mt-8">
          <Button
            label="Send Reset Code"
            onPress={handleSendCode}
            loading={loading}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
