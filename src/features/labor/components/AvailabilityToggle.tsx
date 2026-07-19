/**
 * @file        AvailabilityToggle.tsx
 * @feature     Labor
 * @description Worker availability switch or read-only badge for search visibility.
 * @author      MiStarStudio
 */

import { Switch, Text, View } from 'react-native';

/** Props for editable worker availability or read-only profile display. */
export interface AvailabilityToggleProps {
  available: boolean;
  onChange?: (value: boolean) => void;
  /** When false, renders a static badge instead of an interactive switch. */
  editable?: boolean;
}

/** Controls whether the worker appears in farmer search results. */
export function AvailabilityToggle({
  available,
  onChange,
  editable = true,
}: AvailabilityToggleProps) {
  if (!editable) {
    return (
      <View
        className={`self-start rounded-full px-3 py-1.5 ${
          available ? 'bg-green-100' : 'bg-gray-200'
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            available ? 'text-primary' : 'text-text-muted'
          }`}
        >
          {available ? 'Available for work' : 'Currently unavailable'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-surface p-4">
      <View className="flex-1 pr-4">
        <Text className="text-base font-semibold text-text-primary">Available for work</Text>
        <Text className="mt-1 text-sm text-text-secondary">
          {available
            ? 'Farmers can send you hire requests'
            : 'You will not appear in search results'}
        </Text>
      </View>
      <Switch
        value={available}
        onValueChange={onChange}
        trackColor={{ false: '#D1D5DB', true: '#1A6B3A' }}
        thumbColor="#FFFFFF"
        accessibilityLabel="Toggle work availability"
      />
    </View>
  );
}
