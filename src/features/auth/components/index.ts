/**
 * @file        index.ts
 * @feature     Auth
 * @description Barrel export for auth-specific form components used across login and registration screens.
 * @data        Re-exports only — no runtime logic.
 * @consumes    OTPInput, PasswordInput, PhoneInput, RegionPicker, RoleSelector
 * @author      MiStarStudio
 */

export { OTPInput } from './OTPInput';
export type { OTPInputProps } from './OTPInput';

export { PasswordInput } from './PasswordInput';
export type { PasswordInputProps } from './PasswordInput';

export { PhoneInput } from './PhoneInput';
export type { PhoneInputProps } from './PhoneInput';

export { RegionPicker } from './RegionPicker';
export type { RegionPickerProps } from './RegionPicker';

export { RoleSelector } from './RoleSelector';
export type { RoleSelectorProps } from './RoleSelector';
