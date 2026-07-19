/**
 * @file        FilterPanel.tsx
 * @feature     Equipment
 * @description Bottom sheet for category, price, radius, and sort filter controls.
 * @data        EquipmentFilters, EquipmentSortBy
 * @consumes    BottomSheet, CategoryChip
 * @author      MiStarStudio
 */

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

import { BottomSheet, Button } from '../../../components';
import { ALL_CATEGORIES, CATEGORY_LABELS, DEFAULT_MAX_PRICE, DEFAULT_RADIUS_KM } from '../constants/categories';
import type { EquipmentFilters, EquipmentSortBy } from '../types/equipment.types';
import { CategoryChip } from './CategoryChip';

/** Props for the search screen filter bottom sheet. */
export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: EquipmentFilters;
  onApply: (filters: EquipmentFilters) => void;
  onClear: () => void;
}

const SORT_OPTIONS: { value: EquipmentSortBy; label: string }[] = [
  { value: 'distance', label: 'Nearest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest rated' },
];

/** Draft-then-apply filter UI so sliders do not trigger search on every tick. */
export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onApply,
  onClear,
}: FilterPanelProps) {
  const [draft, setDraft] = useState<EquipmentFilters>(filters);

  useEffect(() => {
    // WHY: reset draft when sheet opens so cancelled edits do not persist
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  const toggleCategory = (category: (typeof ALL_CATEGORIES)[number]) => {
    setDraft((prev) => {
      const exists = prev.category.includes(category);
      return {
        ...prev,
        category: exists
          ? prev.category.filter((c) => c !== category)
          : [...prev.category, category],
      };
    });
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    const cleared: EquipmentFilters = {
      category: [],
      maxPrice: DEFAULT_MAX_PRICE,
      radiusKm: DEFAULT_RADIUS_KM,
      sortBy: 'distance',
    };
    setDraft(cleared);
    onClear();
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Equipment" snapPoints={['85%']}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Text className="mb-2 text-sm font-semibold text-text-primary">Category</Text>
        <View className="mb-4 flex-row flex-wrap gap-2">
          {ALL_CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={CATEGORY_LABELS[category]}
              selected={draft.category.includes(category)}
              onPress={() => toggleCategory(category)}
            />
          ))}
        </View>

        <Text className="mb-2 text-sm font-semibold text-text-primary">
          Max daily price: GHS {Math.round(draft.maxPrice)}
        </Text>
        <Slider
          minimumValue={20}
          maximumValue={600}
          step={10}
          value={draft.maxPrice}
          onValueChange={(maxPrice) => setDraft((prev) => ({ ...prev, maxPrice }))}
          minimumTrackTintColor="#1A6B3A"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#1A6B3A"
        />

        <Text className="mb-2 mt-4 text-sm font-semibold text-text-primary">
          Search radius: {Math.round(draft.radiusKm)} km
        </Text>
        <Slider
          minimumValue={5}
          maximumValue={100}
          step={5}
          value={draft.radiusKm}
          onValueChange={(radiusKm) => setDraft((prev) => ({ ...prev, radiusKm }))}
          minimumTrackTintColor="#1A6B3A"
          maximumTrackTintColor="#E5E7EB"
          thumbTintColor="#1A6B3A"
        />

        <Text className="mb-2 mt-4 text-sm font-semibold text-text-primary">Sort by</Text>
        <View className="mb-6 gap-2">
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setDraft((prev) => ({ ...prev, sortBy: option.value }))}
              accessibilityRole="radio"
              accessibilityState={{ selected: draft.sortBy === option.value }}
              className={`rounded-xl border px-4 py-3 ${
                draft.sortBy === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-surface'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  draft.sortBy === option.value ? 'text-primary' : 'text-text-primary'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button label="Apply Filters" onPress={handleApply} fullWidth />
        <View className="mt-3 mb-4">
          <Button label="Clear All" onPress={handleClear} variant="ghost" fullWidth />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
