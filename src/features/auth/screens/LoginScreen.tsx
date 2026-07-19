/**
 * @file        LoginScreen.tsx
 * @feature     Auth
 * @description Phone-and-password sign-in — primary entry for returning users; dispatches mock credentials until API is live.
 * @data        POST /auth/login (mocked); setCredentials on success
 * @navigation  Login → ForgotPassword, Register; success → Main (via auth state)
 * @consumes    authSlice, mockAuth, PhoneInput, PasswordInput, ScreenContainer
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch } from '../../../app/hooks';
import { Button, ScreenContainer } from '../../../components';
import { setCredentials } from '../slices/authSlice';
import { PhoneInput, PasswordInput, RoleSelector } from '../components';
import type { UserRole } from '../types/auth.types';
import type { LoginFormData } from '../types/auth.types';
import { createMockAuthResponse, createMockUser } from '../utils/mockAuth';
import { isValidGhanaPhone, isValidPassword } from '../utils/validation';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  // ─── State ───

  const dispatch = useAppDispatch();
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [form, setForm] = useState<LoginFormData>({ phone: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loading, setLoading] = useState(false);

  // ─── Validation ───

  const validate = (): boolean => {
    const nextErrors: Partial<LoginFormData> = {};

    if (!isValidGhanaPhone(form.phone)) {
      nextErrors.phone = 'Enter a valid 9–10 digit Ghana phone number';
    }
    if (!isValidPassword(form.password)) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ─── Handlers ───

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO(api): replace with POST /auth/login
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockUser = createMockUser({
        name: 'Demo User',
        phone: form.phone,
        role: selectedRole,
      });
      dispatch(setCredentials(createMockAuthResponse(mockUser)));
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───

  return (
    <ScreenContainer scrollable accessibilityLabel="Login screen">
      <View className="py-6">
        <Text className="text-2xl font-bold text-text-primary">Welcome back</Text>
        <Text className="mt-2 text-base text-text-secondary">
          Sign in to rent equipment or manage your listings
        </Text>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-medium text-text-primary">Sign in as</Text>
          <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
        </View>

        <View className="mt-6 gap-4">
          <PhoneInput
            value={form.phone}
            onChangeText={(phone) => {
              setForm((prev) => ({ ...prev, phone }));
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            error={errors.phone}
          />
          <PasswordInput
            value={form.password}
            onChangeText={(password) => {
              setForm((prev) => ({ ...prev, password }));
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate('ForgotPassword')}
          accessibilityRole="link"
          className="mt-3 self-end"
        >
          <Text className="text-sm font-medium text-secondary">Forgot Password?</Text>
        </Pressable>

        <View className="mt-8">
          <Button label="Login" onPress={handleLogin} loading={loading} fullWidth />
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-sm text-text-secondary">Don&apos;t have an account? </Text>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="link"
          >
            <Text className="text-sm font-semibold text-primary">Register</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
