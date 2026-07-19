/**
 * @file        phoneValidation.ts
 * @feature     Payment
 * @description Ghana mobile number normalization and per-provider prefix validation for MoMo.
 * @data        stripPhoneDigits, formatPhoneDisplay, validateMoMoPhone
 * @author      MiStarStudio
 */

import { PaymentProvider } from '../types/payment.types';

const MTN_PREFIXES = ['24', '54', '55', '59', '25'];
const VODAFONE_PREFIXES = ['20', '50'];
const AIRTELTIGO_PREFIXES = ['26', '27', '56', '57'];

/** Strips country code and leading zero to yield 9–10 digit local number. */
export function stripPhoneDigits(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('233')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

/** Formats digits for display with +233 country prefix. */
export function formatPhoneDisplay(phone: string): string {
  const digits = stripPhoneDigits(phone);
  return digits ? `+233 ${digits}` : '';
}

function getPrefix(digits: string): string {
  return digits.slice(0, 2);
}

/** Returns an error message when the number fails length or provider prefix rules. */
export function validateMoMoPhone(phone: string, provider: PaymentProvider): string | undefined {
  const digits = stripPhoneDigits(phone);

  if (digits.length < 9 || digits.length > 10) {
    return 'Enter a valid 9–10 digit Ghana mobile number';
  }

  const prefix = getPrefix(digits);
  const validators: Record<PaymentProvider, string[]> = {
    [PaymentProvider.MTN_MOMO]: MTN_PREFIXES,
    [PaymentProvider.VODAFONE_CASH]: VODAFONE_PREFIXES,
    [PaymentProvider.AIRTELTIGO]: AIRTELTIGO_PREFIXES,
  };

  // Provider-specific prefixes prevent failed MoMo prompts at the gateway
  if (!validators[provider].includes(prefix)) {
    switch (provider) {
      case PaymentProvider.MTN_MOMO:
        return 'This number does not match MTN prefixes (024, 054, 055, 059, 025)';
      case PaymentProvider.VODAFONE_CASH:
        return 'This number does not match Vodafone prefixes (020, 050)';
      case PaymentProvider.AIRTELTIGO:
        return 'This number does not match AirtelTigo prefixes (026, 027, 056, 057)';
      default:
        return 'Invalid number for selected provider';
    }
  }

  return undefined;
}
