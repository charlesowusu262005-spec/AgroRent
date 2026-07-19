/**
 * @file        EquipmentSummaryRow.tsx
 * @feature     Booking
 * @description Shared equipment thumbnail row used across booking and payment screens.
 * @consumes    CachedImage
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';

import { CachedImage } from '../../../components';

/** Props for a bordered equipment preview row with image and text lines. */
export interface EquipmentSummaryRowProps {
  imageUri: string;
  title: string;
  lines?: string[];
  priceLabel?: string;
  imageLabel?: string;
  className?: string;
}

/** Compact equipment header — avoids duplicating the same flex-row block on four screens. */
export function EquipmentSummaryRow({
  imageUri,
  title,
  lines = [],
  priceLabel,
  imageLabel,
  className = 'mb-6',
}: EquipmentSummaryRowProps) {
  return (
    <View className={`flex-row rounded-2xl border border-gray-200 bg-surface p-3 ${className}`}>
      <CachedImage
        uri={imageUri}
        className="h-20 w-20 rounded-xl bg-gray-200"
        accessibilityLabel={imageLabel ?? title}
      />
      <View className="ml-3 flex-1 justify-center">
        <Text className="text-base font-semibold text-text-primary">{title}</Text>
        {lines.map((line) => (
          <Text key={line} className="mt-1 text-sm text-text-secondary">
            {line}
          </Text>
        ))}
        {priceLabel ? (
          <Text className="mt-1 text-xl font-bold text-primary">{priceLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}
