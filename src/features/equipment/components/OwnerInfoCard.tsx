/**
 * @file        OwnerInfoCard.tsx
 * @feature     Equipment
 * @description Owner summary card shown on equipment detail screen.
 * @data        Equipment.ownerName, memberSince, avgRating
 * @consumes    Avatar, Card, StarRating
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';

import { Avatar, Card, StarRating } from '../../../components';
import type { Equipment } from '../types/equipment.types';

/** Props for the "Listed by" card on detail. */
export interface OwnerInfoCardProps {
  equipment: Equipment;
}

/** Displays owner avatar, name, rating, and membership year. */
export function OwnerInfoCard({ equipment }: OwnerInfoCardProps) {
  return (
    <Card padding="md">
      <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Listed by
      </Text>
      <View className="flex-row items-center">
        <Avatar name={equipment.ownerName} size="md" />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-text-primary">
            {equipment.ownerName}
          </Text>
          <View className="mt-1 flex-row items-center">
            <StarRating rating={equipment.avgRating} size={14} />
            <Text className="ml-2 text-sm text-text-secondary">
              Member since {equipment.memberSince}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
