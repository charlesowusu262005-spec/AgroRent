/**
 * @file        NewPasswordScreen.tsx
 * @feature     Auth
 * @description Final step of password reset — set new password after OTP verification for reset flow.
 * @data        POST /auth/reset-password (mocked)
 * @navigation  NewPassword → Login
 * @consumes    PasswordInput, validation, ScreenContainer
 * @author      MiStarStudio
 */

import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, ScreenContainer } from '../../../components';
import { PasswordInput } from '../components';
import type { NewPasswordFormData } from '../types/auth.types';
import { isValidPassword, passwordsMatch } from '../utils/validation';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'NewPassword'>;

export function NewPasswordScreen({ navigation, route }: Props) {
  // ─── State ───

  const { phone } = route.params;
  const [form, setForm] = useState<NewPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<NewPasswordFormData>>({});
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(
    () =>
      isValidPassword(form.password) &&
      passwordsMatch(form.password, form.confirmPassword),
    [form],
  );

  // ─── Handlers ───

  const handleSubmit = async () => {
    const nextErrors: Partial<NewPasswordFormData> = {};

    if (!isValidPassword(form.password)) {
      nextErrors.password = 'Password is required';
    }
    if (!passwordsMatch(form.password, form.confirmPassword)) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      // TODO(api): replace with POST /auth/reset-password
      await new Promise((resolve) => setTimeout(resolve, 600));

      navigation.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───

  return (
    <ScreenContainer scrollable accessibilityLabel="New password screen">
      <View className="py-6">
        <Text className="text-2xl font-bold text-text-primary">Set new password</Text>
        <Text className="mt-2 text-base text-text-secondary">
          Create a new password for {phone}
        </Text>

        <View className="mt-8 gap-4">
          <PasswordInput
            label="New Password"
            value={form.password}
            onChangeText={(password) => {
              setForm((prev) => ({ ...prev, password }));
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
          />
          <PasswordInput
            label="Confirm New Password"
            value={form.confirmPassword}
            onChangeText={(confirmPassword) => {
              setForm((prev) => ({ ...prev, confirmPassword }));
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            error={errors.confirmPassword}
            placeholder="Re-enter your new password"
          />
        </View>

        <View className="mt-8">
          <Button
            label="Update Password"
            onPress={handleSubmit}
            loading={loading}
            disabled={!isValid}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
