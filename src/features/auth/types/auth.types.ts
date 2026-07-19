/**
 * @file        auth.types.ts
 * @feature     Auth
 * @description Shared TypeScript contracts for auth forms, user identity, and OTP flows so screens and Redux stay aligned.
 * @data        Local form state; eventual API payloads for POST /auth/login, /auth/register, /auth/verify-otp, /auth/reset-password
 * @consumes    —
 * @author      MiStarStudio
 */

/** Marketplace persona chosen at registration — drives post-login navigation and permissions. */
export type UserRole = 'FARMER' | 'OWNER' | 'WORKER';

/** Distinguishes OTP flows so the verification screen routes to register completion vs password reset. */
export type OTPPurpose = 'register' | 'reset';

/** Authenticated user profile persisted in Redux after login or successful OTP verification. */
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  region?: string; // Ghana administrative region for localised listings and search
}

/** Login form fields — phone is stored without country prefix; UI shows +233. */
export interface LoginFormData {
  phone: string;
  password: string;
}

/** Two-step registration payload collected across role selection and detail screens. */
export interface RegisterFormData {
  role: UserRole;
  name: string;
  phone: string;
  email?: string; // Optional in Ghana where phone is the primary identifier
  password: string;
  confirmPassword: string;
  region: string;
}

/** Payload sent when verifying an SMS OTP for register or password-reset flows. */
export interface OTPVerifyData {
  phone: string;
  otp: string;
  purpose?: OTPPurpose;
}

/** Password-reset final step after OTP has been confirmed. */
export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}
