/**
 * @file        OTPVerificationScreen.tsx
 * @feature     Auth
 * @description Verifies SMS OTP for registration or password reset — branches post-verify based on purpose param.
 * @data        POST /auth/verify-otp, POST /auth/resend-otp (mocked)
 * @navigation  OTPVerification → NewPassword (reset) or Main via setCredentials (register); resend cooldown 60s
 * @consumes    OTPInput, authSlice, mockAuth, validation
 * @author      MiStarStudio
 */

import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch } from '../../../app/hooks';
import { Button, ScreenContainer } from '../../../components';
import { OTPInput } from '../components';
import { setCredentials } from '../slices/authSlice';
import type { OTPVerifyData } from '../types/auth.types';
import { createMockAuthResponse, createMockUser } from '../utils/mockAuth';
import { formatPhoneForDisplay, isValidOtp } from '../utils/validation';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

/** Cooldown before resend is allowed — reduces SMS cost abuse in production. */
const RESEND_SECONDS = 60;

export function OTPVerificationScreen({ navigation, route }: Props) {
  // ─── State ───

  const dispatch = useAppDispatch();
  const { phone = '', purpose = 'register', registerData } = route.params ?? {};
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  // ─── Effects ───

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // ─── Handlers ───

  const handleVerify = async () => {
    const payload: OTPVerifyData = { phone, otp, purpose };

    if (!isValidOtp(payload.otp)) {
      setError('Enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // TODO(api): replace with POST /auth/verify-otp
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Reset flow continues to new password; register flow logs user in immediately
      if (purpose === 'reset') {
        navigation.navigate('NewPassword', { phone });
        return;
      }

      const mockUser = createMockUser({
        name: registerData?.name ?? 'New User',
        phone,
        role: registerData?.role ?? 'FARMER',
        email: registerData?.email,
        region: registerData?.region,
      });
      dispatch(setCredentials(createMockAuthResponse(mockUser)));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    // TODO(api): replace with POST /auth/resend-otp
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSecondsLeft(RESEND_SECONDS);
    setOtp('');
    setError(undefined);
  };

  // ─── Render ───

  return (
    <ScreenContainer scrollable accessibilityLabel="OTP verification screen">
      <View className="py-6">
        <Text className="text-2xl font-bold text-text-primary">Verify your number</Text>
        <Text className="mt-2 text-base text-text-secondary">
          Enter the 6-digit code sent to{' '}
          <Text className="font-semibold text-text-primary">
            {formatPhoneForDisplay(phone)}
          </Text>
        </Text>

        <View className="mt-10">
          <OTPInput value={otp} onChange={setOtp} error={error} />
        </View>

        <View className="mt-8">
          <Button label="Verify" onPress={handleVerify} loading={loading} fullWidth />
        </View>

        <View className="mt-6 items-center">
          {secondsLeft > 0 ? (
            <Text className="text-sm text-text-secondary">
              Resend code in {secondsLeft}s
            </Text>
          ) : (
            <Pressable onPress={handleResend} accessibilityRole="button">
              <Text className="text-sm font-semibold text-primary">Resend code</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
