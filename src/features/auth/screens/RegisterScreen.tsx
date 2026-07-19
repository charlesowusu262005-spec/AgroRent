/**
 * @file        RegisterScreen.tsx
 * @feature     Auth
 * @description Two-step registration: choose marketplace role, then enter profile details before OTP verification.
 * @data        POST /auth/register (mocked); registerData passed to OTPVerification
 * @navigation  Register → OTPVerification (purpose: register)
 * @consumes    RoleSelector, PhoneInput, PasswordInput, RegionPicker, validation
 * @author      MiStarStudio
 */

import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, Input, ScreenContainer } from '../../../components';
import { PhoneInput, PasswordInput, RegionPicker, RoleSelector } from '../components';
import type { RegisterFormData, UserRole } from '../types/auth.types';
import {
  isValidEmail,
  isValidGhanaPhone,
  isValidPassword,
  passwordsMatch,
} from '../utils/validation';
import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

/** Step-2 form omits role — held separately until both steps complete. */
type RegisterFormState = Omit<RegisterFormData, 'role'>;

const INITIAL_FORM: RegisterFormState = {
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  region: '',
};

export function RegisterScreen({ navigation }: Props) {
  // ─── State ───

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState<RegisterFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const isStepOneValid = selectedRole !== null;

  const isStepTwoValid = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      isValidGhanaPhone(form.phone) &&
      isValidEmail(form.email ?? '') &&
      isValidPassword(form.password) &&
      passwordsMatch(form.password, form.confirmPassword) &&
      form.region.length > 0
    );
  }, [form]);

  // ─── Validation ───

  const validateStepTwo = (): boolean => {
    const nextErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!form.name.trim()) nextErrors.name = 'Full name is required';
    if (!isValidGhanaPhone(form.phone)) {
      nextErrors.phone = 'Enter a valid 9–10 digit Ghana phone number';
    }
    if (!isValidEmail(form.email ?? '')) nextErrors.email = 'Enter a valid email address';
    if (!isValidPassword(form.password)) nextErrors.password = 'Password is required';
    if (!passwordsMatch(form.password, form.confirmPassword)) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    if (!form.region) nextErrors.region = 'Please select your region';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ─── Handlers ───

  const handleRegister = async () => {
    if (!validateStepTwo() || !selectedRole) return;

    setLoading(true);
    try {
      // TODO(api): replace with POST /auth/register
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Registration completes only after OTP — pass collected data through navigation params
      navigation.navigate('OTPVerification', {
        phone: form.phone,
        purpose: 'register',
        registerData: { ...form, role: selectedRole },
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof RegisterFormState>(key: K, value: RegisterFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // ─── Render ───

  return (
    <ScreenContainer scrollable accessibilityLabel="Register screen">
      <View className="py-4">
        <Text className="text-2xl font-bold text-text-primary">Create account</Text>
        <Text className="mt-2 text-base text-text-secondary">
          Step {step} of 2 — {step === 1 ? 'Choose your role' : 'Your details'}
        </Text>

        {step === 1 ? (
          <View className="mt-6">
            <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
            <View className="mt-8">
              <Button
                label="Continue"
                onPress={() => setStep(2)}
                disabled={!isStepOneValid}
                fullWidth
              />
            </View>
          </View>
        ) : (
          <View className="mt-6 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChangeText={(name) => updateField('name', name)}
              error={errors.name}
              placeholder="Kwame Mensah"
              autoCapitalize="words"
            />
            <PhoneInput
              value={form.phone}
              onChangeText={(phone) => updateField('phone', phone)}
              error={errors.phone}
            />
            <Input
              label="Email (optional)"
              value={form.email ?? ''}
              onChangeText={(email) => updateField('email', email)}
              error={errors.email}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <RegionPicker
              value={form.region}
              onChange={(region) => updateField('region', region)}
              error={errors.region}
            />
            <PasswordInput
              label="Password"
              value={form.password}
              onChangeText={(password) => updateField('password', password)}
              error={errors.password}
            />
            <PasswordInput
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(confirmPassword) => updateField('confirmPassword', confirmPassword)}
              error={errors.confirmPassword}
              placeholder="Re-enter your password"
            />

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Button label="Back" variant="secondary" onPress={() => setStep(1)} fullWidth />
              </View>
              <View className="flex-1">
                <Button
                  label="Register"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={!isStepTwoValid}
                  fullWidth
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
