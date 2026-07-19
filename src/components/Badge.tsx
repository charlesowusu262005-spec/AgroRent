/**
 * @file        Badge.tsx
 * @feature     Design System
 * @description Colour-coded status pill used on bookings, payments, and jobs.
 * @data        Presentational — parent passes status string from API enums.
 * @consumes    NativeWind semantic colour tokens
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';

/** Default mapping from backend status codes to Tailwind class pairs. */
export const DEFAULT_STATUS_COLOR_MAP: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-green-100 text-primary',
  ACTIVE: 'bg-green-100 text-primary',
  COMPLETED: 'bg-green-100 text-success',
  CANCELLED: 'bg-red-100 text-danger',
  REJECTED: 'bg-red-100 text-danger',
  IN_PROGRESS: 'bg-blue-100 text-secondary',
  DEFAULT: 'bg-gray-100 text-text-secondary',
};

/** Splits combined Tailwind classes into container vs text colour groups. */
function parseStatusClasses(classString: string): { container: string; text: string } {
  const classes = classString.split(' ').filter(Boolean);
  const container = classes.find((cls) => cls.startsWith('bg-')) ?? 'bg-gray-100';
  const text =
    classes.filter((cls) => cls.startsWith('text-')).join(' ') || 'text-text-secondary';
  return { container, text };
}

/** Props for a single status badge. */
export interface BadgeProps {
  /** Raw status from API (e.g. PENDING, PAID); normalised to uppercase internally. */
  status: string;
  statusColorMap?: Record<string, string>;
  accessibilityLabel?: string;
}

/**
 * Renders a compact status label with semantic colours.
 * Unknown statuses fall back to DEFAULT so new API values never render unstyled.
 */
export function Badge({
  status,
  statusColorMap = DEFAULT_STATUS_COLOR_MAP,
  accessibilityLabel,
}: BadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const colorClasses =
    statusColorMap[normalizedStatus] ??
    statusColorMap.DEFAULT ??
    DEFAULT_STATUS_COLOR_MAP.DEFAULT;
  const { container, text } = parseStatusClasses(colorClasses);

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `Status: ${status}`}
      className={`self-start rounded-full px-2.5 py-1 ${container}`}
    >
      <Text className={`text-xs font-semibold uppercase ${text}`}>
        {status.replace(/_/g, ' ')}
      </Text>
    </View>
  );
}
