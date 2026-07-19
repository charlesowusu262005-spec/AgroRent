/**
 * @file        AuthNavigator.tsx
 * @feature     Navigation
 * @description Unauthenticated stack for splash, login, registration, and password recovery.
 * @navigation  RootStack > Auth
 * @data        AuthStackParamList route params (phone, OTP purpose, register payload)
 * @consumes    auth feature screens, backOnlyHeaderOptions, hiddenHeaderOptions
 * @author      MiStarStudio
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ForgotPasswordScreen,
  LoginScreen,
  NewPasswordScreen,
  OTPVerificationScreen,
  RegisterScreen,
  SplashScreen,
} from '../features/auth/screens';
import { backOnlyHeaderOptions, hiddenHeaderOptions } from './options';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Native stack for the full sign-in / sign-up / recovery journey. */
export function AuthNavigator() {
  return (
    <Stack.Navigator
      // WHY Splash first: branded cold-start while persisted tokens are checked;
      // Splash then replaces itself with Login or triggers auto-login without flashing Main.
      initialRouteName="Splash"
      screenOptions={hiddenHeaderOptions}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPasswordScreen}
        options={backOnlyHeaderOptions}
      />
    </Stack.Navigator>
  );
}
