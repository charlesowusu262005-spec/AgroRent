/**
 * @file        index.ts
 * @feature     Auth
 * @description Barrel export for all auth stack screens consumed by AuthNavigator.
 * @data        Re-exports only — no runtime logic.
 * @navigation  Splash, Login, Register, OTPVerification, ForgotPassword, NewPassword
 * @consumes    ForgotPasswordScreen, LoginScreen, NewPasswordScreen, OTPVerificationScreen, RegisterScreen, SplashScreen
 * @author      MiStarStudio
 */

export { ForgotPasswordScreen } from './ForgotPasswordScreen';
export { LoginScreen } from './LoginScreen';
export { NewPasswordScreen } from './NewPasswordScreen';
export { OTPVerificationScreen } from './OTPVerificationScreen';
export { RegisterScreen } from './RegisterScreen';
export { SplashScreen } from './SplashScreen';
