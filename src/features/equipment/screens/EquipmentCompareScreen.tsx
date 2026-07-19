/**
 * @file        EquipmentCompareScreen.tsx
 * @feature     Equipment
 * @description Side-by-side comparison table for up to 3 selected listings.
 * @navigation  EquipmentStack > Compare
 * @data        equipmentIds route param, MOCK_EQUIPMENT, userLocation
 * @author      MiStarStudio
 */

import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenContainer } from '../../../components';
import type { EquipmentStackParamList } from '../../../navigation/types';
import { MOCK_EQUIPMENT } from '../data/mockEquipmentData';
import { CATEGORY_LABELS } from '../constants/categories';
import { formatDistance, getDistanceKm } from '../utils/distance';
import { useAppSelector } from '../../../app/hooks';
import type { Equipment } from '../types/equipment.types';

type Props = NativeStackScreenProps<EquipmentStackParamList, 'Compare'>;

/** Horizontal scroll table comparing rate, rating, distance, and category. */
export function EquipmentCompareScreen({ route }: Props) {
  const { equipmentIds } = route.params;
  const { userLocation, searchResults, selectedEquipment } = useAppSelector(
    (state) => state.equipment,
  );

  const equipmentById = useMemo(() => {
    const map = new Map<string, Equipment>();
    for (const item of MOCK_EQUIPMENT) map.set(item.id, item);
    for (const item of searchResults) map.set(item.id, item);
    if (selectedEquipment) map.set(selectedEquipment.id, selectedEquipment);
    return map;
  }, [searchResults, selectedEquipment]);

  // TODO(api): replace with GET /equipment/compare?ids= — resolve items from API
  const items = useMemo(
    () =>
      equipmentIds
        .map((id) => equipmentById.get(id))
        .filter(Boolean)
        // WHY: match compare toggle cap of 3 items from search screen
        .slice(0, 3),
    [equipmentIds, equipmentById],
  );

  const rows = [
    { label: 'Daily Rate', getValue: (id: string) => {
      const eq = equipmentById.get(id);
      return eq ? `GHS ${eq.dailyRate}` : '—';
    }},
    { label: 'Weekly Rate', getValue: (id: string) => {
      const eq = equipmentById.get(id);
      return eq ? `GHS ${eq.weeklyRate}` : '—';
    }},
    { label: 'Rating', getValue: (id: string) => {
      const eq = equipmentById.get(id);
      return eq ? `${eq.avgRating} ★` : '—';
    }},
    { label: 'Distance', getValue: (id: string) => {
      const eq = equipmentById.get(id);
      if (!eq) return '—';
      return formatDistance(
        getDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          eq.latitude,
          eq.longitude,
        ),
      );
    }},
    { label: 'Category', getValue: (id: string) => {
      const eq = equipmentById.get(id);
      return eq ? CATEGORY_LABELS[eq.category] : '—';
    }},
  ];

  if (items.length < 2) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">
          Select at least 2 items from search to compare.
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable accessibilityLabel="Compare equipment">
      <Text className="mb-4 text-2xl font-bold text-text-primary">Compare Equipment</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View className="flex-row border-b border-gray-200 pb-3">
            <View className="w-28" />
            {items.map((item) => (
              <View key={item!.id} className="w-36 px-2">
                <Text className="text-sm font-semibold text-text-primary" numberOfLines={2}>
                  {item!.name}
                </Text>
              </View>
            ))}
          </View>

          {rows.map((row) => (
            <View key={row.label} className="flex-row border-b border-gray-100 py-3">
              <Text className="w-28 text-sm font-medium text-text-secondary">{row.label}</Text>
              {items.map((item) => (
                <Text key={item!.id} className="w-36 px-2 text-sm text-text-primary">
                  {row.getValue(item!.id)}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
