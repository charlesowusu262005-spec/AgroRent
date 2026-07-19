/**
 * @file        JobCard.tsx
 * @feature     Labor
 * @description Shared hire-job row for worker inbox, dashboard, and earnings lists.
 * @consumes    Card
 * @author      MiStarStudio
 */

import { memo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Card } from '../../../components';
import type { LaborJob } from '../types/labor.types';

/** Props for a labor job summary card with optional press and footer actions. */
export interface JobCardProps {
  job: LaborJob;
  onPress?: () => void;
  variant?: 'list' | 'incoming' | 'completed';
  footer?: ReactNode;
  className?: string;
}

/** Memoized job row — used across worker jobs, dashboard inbox, and earnings history. */
function JobCardComponent({
  job,
  onPress,
  variant = 'list',
  footer,
  className = 'mb-3',
}: JobCardProps) {
  const content =
    variant === 'completed' ? (
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-text-primary">{job.serviceType}</Text>
          <Text className="mt-1 text-sm text-text-secondary">{job.farmerName}</Text>
          <Text className="mt-1 text-xs text-text-muted">{job.jobDate}</Text>
        </View>
        <Text className="text-lg font-bold text-primary">GHS {job.agreedAmount}</Text>
      </View>
    ) : variant === 'incoming' ? (
      <>
        <Text className="text-base font-semibold text-text-primary">{job.serviceType}</Text>
        <Text className="mt-1 text-sm text-text-secondary">{job.farmerName}</Text>
        <Text className="mt-1 text-sm text-text-secondary">
          {job.jobDate} · {job.locationName}
        </Text>
        <Text className="mt-1 text-base font-bold text-primary">GHS {job.agreedAmount}</Text>
        {footer}
      </>
    ) : (
      <>
        <Text className="text-base font-semibold text-text-primary">{job.serviceType}</Text>
        <Text className="mt-1 text-sm text-text-secondary">{job.farmerName}</Text>
        <Text className="mt-1 text-sm text-text-secondary">
          {job.jobDate} · GHS {job.agreedAmount}
        </Text>
        <Text className="mt-2 text-xs font-semibold uppercase text-primary">{job.status}</Text>
      </>
    );

  const card = <Card padding="md">{content}</Card>;

  if (!onPress) {
    return <View className={className}>{card}</View>;
  }

  return (
    <Pressable onPress={onPress} className={className} accessibilityRole="button">
      {card}
    </Pressable>
  );
}

export const JobCard = memo(JobCardComponent);
