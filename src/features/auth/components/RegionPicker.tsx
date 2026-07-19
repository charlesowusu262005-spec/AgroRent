/**
 * @file        RegionPicker.tsx
 * @feature     Auth
 * @description Bottom-sheet region selector for Ghana registration — ensures users pick a valid administrative region.
 * @data        GHANA_REGIONS constant; eventual GET /regions
 * @consumes    constants/regions, lucide-react-native
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { GHANA_REGIONS } from '../constants/regions';

/** Props for the modal region picker on RegisterScreen. */
export interface RegionPickerProps {
  label?: string;
  value: string;
  onChange: (region: string) => void;
  error?: string;
}

/** Opens a slide-up modal listing all 16 Ghana regions for registration. */
export function RegionPicker({
  label = 'Region',
  value,
  onChange,
  error,
}: RegionPickerProps) {
  // ─── State ───

  const [isOpen, setIsOpen] = useState(false);

  const borderClass = error ? 'border-danger' : 'border-gray-300';

  // ─── Render ───

  return (
    <View className="w-full">
      <Text className="mb-1.5 text-sm font-medium text-text-primary">{label}</Text>
      <Pressable
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${value || 'Select region'}`}
        className={`flex-row items-center justify-between rounded-xl border bg-surface px-3 py-3.5 ${borderClass}`}
      >
        <Text className={value ? 'text-base text-text-primary' : 'text-base text-text-muted'}>
          {value || 'Select your region'}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </Pressable>
      {error ? (
        <Text className="mt-1.5 text-sm text-danger" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Modal visible={isOpen} transparent animationType="slide">
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setIsOpen(false)}
        >
          {/* Inner Pressable stops tap-through from closing modal when scrolling the list */}
          <Pressable className="max-h-[70%] rounded-t-3xl bg-surface" onPress={() => {}}>
            <View className="border-b border-gray-200 px-4 py-4">
              <Text className="text-center text-lg font-semibold text-text-primary">
                Select Region
              </Text>
            </View>
            <ScrollView>
              {GHANA_REGIONS.map((region) => (
                <Pressable
                  key={region}
                  onPress={() => {
                    onChange(region);
                    setIsOpen(false);
                  }}
                  accessibilityRole="button"
                  className={`border-b border-gray-100 px-4 py-4 ${
                    value === region ? 'bg-primary/5' : ''
                  }`}
                >
                  <Text
                    className={`text-base ${
                      value === region ? 'font-semibold text-primary' : 'text-text-primary'
                    }`}
                  >
                    {region}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
