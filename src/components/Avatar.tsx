/**
 * @file        Avatar.tsx
 * @feature     Design System
 * @description User avatar with image fallback to initials — used on profiles, cards, and reviews.
 * @data        Presentational — `imageUrl` from user profile or review author.
 * @consumes    NativeWind primary tint for initials fallback
 * @author      MiStarStudio
 */

import { Image, Text, View } from 'react-native';

/** Preset diameters for avatar circles. */
export type AvatarSize = 'sm' | 'md' | 'lg';

/** Props for the shared Avatar component. */
export interface AvatarProps {
  imageUrl?: string | null;
  name: string;
  size?: AvatarSize;
  accessibilityLabel?: string;
}

const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'h-8 w-8', text: 'text-xs' },
  md: { container: 'h-12 w-12', text: 'text-base' },
  lg: { container: 'h-16 w-16', text: 'text-xl' },
};

/** Builds two-letter initials from first and last name tokens. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * Shows remote image when available; otherwise initials on a branded background.
 * Avoids broken-image UX when CDN URLs fail or user has no photo.
 */
export function Avatar({
  imageUrl,
  name,
  size = 'md',
  accessibilityLabel,
}: AvatarProps) {
  const sizeStyle = sizeClasses[size];
  const initials = getInitials(name);

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel ?? `${name} avatar`}
        className={`rounded-full bg-gray-200 ${sizeStyle.container}`}
      />
    );
  }

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? `${name} avatar`}
      className={`items-center justify-center rounded-full bg-primary/15 ${sizeStyle.container}`}
    >
      <Text className={`font-bold text-primary ${sizeStyle.text}`}>{initials}</Text>
    </View>
  );
}
