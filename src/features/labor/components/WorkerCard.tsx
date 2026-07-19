/**
 * @file        WorkerCard.tsx
 * @feature     Labor
 * @description Search result card showing worker avatar, skills, rating, rate, and distance.
 * @data        WorkerProfile, GeoPoint
 * @consumes    SkillBadge, Avatar, StarRating, filterWorkers.getWorkerDistance
 * @author      MiStarStudio
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';

import { Avatar, Card, StarRating } from '../../../components';
import type { WorkerProfile } from '../types/labor.types';
import { formatDistance } from '../../equipment/utils/distance';
import { getWorkerDistance } from '../utils/filterWorkers';
import type { GeoPoint } from '../../equipment/types/equipment.types';
import { SkillBadge } from './SkillBadge';

/** Props for a tappable worker summary in the search results list. */
export interface WorkerCardProps {
  worker: WorkerProfile;
  userLocation: GeoPoint;
  onPress: () => void;
}

/** Memoized worker row — limits skill chips to three to keep card height consistent. */
function WorkerCardComponent({ worker, userLocation, onPress }: WorkerCardProps) {
  const distance = getWorkerDistance(worker, userLocation);

  return (
    <Card onPress={onPress} padding="md" accessibilityLabel={`Worker ${worker.name}`}>
      <View className="flex-row">
        <Avatar name={worker.name} imageUrl={worker.avatarUrl} size="md" />
        <View className="ml-3 flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 text-base font-semibold text-text-primary">{worker.name}</Text>
            <Text
              className={`text-xs font-semibold ${
                worker.available ? 'text-primary' : 'text-text-muted'
              }`}
            >
              {worker.available ? 'Available' : 'Busy'}
            </Text>
          </View>
          <Text className="mt-0.5 text-sm text-text-secondary">{worker.region}</Text>
          <View className="mt-2 flex-row flex-wrap">
            {worker.skills.slice(0, 3).map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <StarRating rating={worker.avgRating} size={14} />
            <Text className="text-sm font-bold text-primary">GHS {worker.hourlyRate}/hr</Text>
          </View>
          <View className="mt-1 flex-row items-center">
            <MapPin size={12} color="#6B7280" />
            <Text className="ml-1 text-xs text-text-muted">{formatDistance(distance)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export const WorkerCard = memo(WorkerCardComponent);
