/**
 * @file        validation.ts
 * @feature     Auth
 * @description Client-side validation for Ghana phone numbers, passwords, email, and OTP before API calls — gives immediate feedback on poor connectivity.
 * @data        Pure functions over local form strings; mirrors expected server-side rules
 * @consumes    —
 * @author      MiStarStudio
 */

/** Strips non-digits so users may paste +233 or spaces without breaking validation. */
export function stripPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Ghana mobile numbers are 9 digits (no leading 0) or 10 digits (with leading 0).
 * UI collects digits after +233; we accept both local conventions.
 */
export function isValidGhanaPhone(phone: string): boolean {
  const digits = stripPhoneDigits(phone);
  return digits.length >= 9 && digits.length <= 10;
}

/** Prepends +233 for display on OTP and confirmation screens. */
export function formatPhoneForDisplay(phone: string): string {
  const digits = stripPhoneDigits(phone);
  return `+233 ${digits}`;
}

/** Minimal password rule for MVP — stricter policy can be enforced server-side later. */
export function isValidPassword(password: string): boolean {
  return password.trim().length > 0;
}

/** Ensures confirm field matches and is non-empty to prevent accidental blank passwords. */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

/** Email is optional at registration; empty string passes, non-empty must look like an email. */
export function isValidEmail(email: string): boolean {
  if (!email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** OTP is always six numeric digits — matches typical Ghana SMS provider format. */
export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}
