/**
 * @file        CategoryChip.tsx
 * @feature     Equipment
 * @description Toggle chip for category filter selection in search and listing forms.
 * @consumes    —
 * @author      MiStarStudio
 */

import { Pressable, Text } from 'react-native';

/** Props for a single selectable category pill. */
export interface CategoryChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/** Pressable pill showing selected vs unselected filter state. */
export function CategoryChip({ label, selected = false, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} category filter`}
      className={`mr-2 rounded-full px-4 py-2 ${
        selected ? 'bg-primary' : 'border border-gray-200 bg-surface'
      }`}
    >
      <Text
        className={`text-sm font-medium ${selected ? 'text-white' : 'text-text-secondary'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
