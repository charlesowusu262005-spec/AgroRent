/**
 * @file        WorkerProfileScreen.tsx
 * @feature     Labor
 * @description Full worker profile with skills, certifications, reviews, and hire CTA.
 * @navigation  LaborStack > WorkerDetail
 * @data        workerId route param
 * @consumes    AvailabilityToggle, SkillBadge, ReviewList, fetchWorkerById, mockLaborData
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Avatar, Button, LoadingSpinner, ScreenContainer, StarRating } from '../../../components';
import type { LaborStackParamList } from '../../../navigation/types';
import { AvailabilityToggle, SkillBadge } from '../components';
import { getWorkerById } from '../data/mockLaborData';
import { fetchWorkerById } from '../slices/laborSlice';
import { ReviewList } from '../../reviews/components';

type Props = NativeStackScreenProps<LaborStackParamList, 'WorkerDetail'>;

/** Worker detail with sticky hire button — uses mock lookup until API populates Redux. */
export function WorkerProfileScreen({ navigation, route }: Props) {
  const { workerId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedWorker, isLoading } = useAppSelector((state) => state.labor);
  const worker =
    selectedWorker?.userId === workerId ? selectedWorker : getWorkerById(workerId);

  useEffect(() => {
    void dispatch(fetchWorkerById(workerId));
  }, [dispatch, workerId]);

  if (isLoading && !worker) {
    return <LoadingSpinner label="Loading worker profile..." />;
  }

  if (!worker) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">Worker not found.</Text>
      </ScreenContainer>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* ─── Profile header ─── */}
        <View className="items-center px-4 pb-6 pt-6">
          <Avatar name={worker.name} imageUrl={worker.avatarUrl} size="lg" />
          <Text className="mt-4 text-2xl font-bold text-text-primary">{worker.name}</Text>
          <Text className="mt-1 text-base text-text-secondary">{worker.region}</Text>
          <View className="mt-3">
            <AvailabilityToggle available={worker.available} editable={false} />
          </View>
          <View className="mt-3 flex-row items-center">
            <StarRating rating={worker.avgRating} size={18} />
            <Text className="ml-2 text-sm text-text-secondary">
              {worker.avgRating} ({worker.reviewCount} reviews)
            </Text>
          </View>
          <Text className="mt-2 text-lg font-bold text-primary">GHS {worker.hourlyRate}/hour</Text>
        </View>

        {worker.bio ? (
          <View className="mb-6 px-4">
            <Text className="text-base leading-6 text-text-secondary">{worker.bio}</Text>
          </View>
        ) : null}

        <View className="mb-6 px-4">
          <Text className="mb-3 text-lg font-semibold text-text-primary">Skills</Text>
          <View className="flex-row flex-wrap">
            {worker.skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="outline" />
            ))}
          </View>
        </View>

        <View className="mb-6 px-4">
          <Text className="mb-3 text-lg font-semibold text-text-primary">Certifications</Text>
          {worker.certifications.length > 0 ? (
            worker.certifications.map((cert) => (
              <Text key={cert} className="mb-2 text-sm text-text-secondary">
                • {cert}
              </Text>
            ))
          ) : (
            <Text className="text-sm text-text-muted">No certifications listed</Text>
          )}
        </View>

        {/* ─── Reviews ─── */}
        <View className="mb-28 px-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-text-primary">Reviews</Text>
            <Button
              label="Write Review"
              variant="secondary"
              onPress={() =>
                navigation.navigate('SubmitReview', {
                  targetId: workerId,
                  targetType: 'WORKER',
                  targetName: worker.name,
                })
              }
            />
          </View>
          <ReviewList targetId={workerId} targetType="WORKER" />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-surface px-4 py-4">
        <Button
          label="Send Hire Request"
          onPress={() => navigation.navigate('HireRequest', { workerId })}
          fullWidth
        />
      </View>
    </View>
  );
}
