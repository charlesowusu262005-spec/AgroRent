/**
 * @file        EquipmentCard.tsx
 * @feature     Equipment
 * @description List item card for search results and owner listings.
 * @data        Equipment, GeoPoint
 * @consumes    CachedImage, Card, StarRating, CATEGORY_LABELS
 * @author      MiStarStudio
 */

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';

import { CachedImage, Card, StarRating } from '../../../components';
import { CATEGORY_LABELS } from '../constants/categories';
import { formatDistance, getDistanceKm } from '../utils/distance';
import type { Equipment, GeoPoint } from '../types/equipment.types';

/** Props for a tappable equipment summary row with optional compare checkbox. */
export interface EquipmentCardProps {
  equipment: Equipment;
  userLocation: GeoPoint;
  onPress: () => void;
  compareMode?: boolean;
  isSelectedForCompare?: boolean;
  onToggleCompare?: () => void;
}

/** Fixed height for FlatList getItemLayout (image 160 + content ~128 + margin 16). */
export const EQUIPMENT_CARD_HEIGHT = 304;

/** Memoized card to reduce re-renders during FlatList scroll. */
function EquipmentCardComponent({
  equipment,
  userLocation,
  onPress,
  compareMode = false,
  isSelectedForCompare = false,
  onToggleCompare,
}: EquipmentCardProps) {
  const distanceKm = getDistanceKm(
    userLocation.latitude,
    userLocation.longitude,
    equipment.latitude,
    equipment.longitude,
  );

  return (
    <View className="mb-4 overflow-hidden rounded-2xl" style={{ height: EQUIPMENT_CARD_HEIGHT - 16 }}>
      <Card onPress={onPress} padding="none" accessibilityLabel={equipment.name}>
        <View className="relative">
          <CachedImage
            uri={equipment.images[0]}
            className="h-40 w-full bg-gray-200"
            accessibilityLabel={`${equipment.name} image`}
          />
          {compareMode ? (
            <Pressable
              onPress={onToggleCompare}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelectedForCompare }}
              accessibilityLabel={`Compare ${equipment.name}`}
              className={`absolute right-3 top-3 h-7 w-7 items-center justify-center rounded-md border-2 ${
                isSelectedForCompare
                  ? 'border-primary bg-primary'
                  : 'border-white bg-white/90'
              }`}
            >
              {isSelectedForCompare ? (
                <Text className="text-sm font-bold text-white">✓</Text>
              ) : null}
            </Pressable>
          ) : null}
          <View className="absolute bottom-3 left-3 rounded-full bg-primary px-2.5 py-1">
            <Text className="text-xs font-semibold text-white">
              {CATEGORY_LABELS[equipment.category]}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-lg font-semibold text-text-primary" numberOfLines={1}>
            {equipment.name}
          </Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-base font-bold text-primary">
              GHS {equipment.dailyRate}
              <Text className="text-sm font-normal text-text-secondary">/day</Text>
            </Text>
            <View className="flex-row items-center">
              <MapPin size={14} color="#6B7280" />
              <Text className="ml-1 text-sm text-text-secondary">
                {formatDistance(distanceKm)}
              </Text>
            </View>
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <StarRating rating={equipment.avgRating} size={14} />
            <Text className="text-xs text-text-muted">
              ({equipment.reviewCount} reviews)
            </Text>
          </View>
          <Text className="mt-1 text-sm text-text-secondary" numberOfLines={1}>
            {equipment.locationName}
          </Text>
        </View>
      </Card>
    </View>
  );
}

export const EquipmentCard = memo(EquipmentCardComponent);
