/**
 * @file        JobStatusTimeline.tsx
 * @feature     Labor
 * @description Four-step progress indicator for hire job lifecycle states.
 * @data        JobStatus
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';

import { JobStatus } from '../types/labor.types';

/** Props for the horizontal job progress stepper on the tracking screen. */
export interface JobStatusTimelineProps {
  status: JobStatus;
}

const STEPS: { key: JobStatus; label: string }[] = [
  { key: JobStatus.PENDING, label: 'Pending' },
  { key: JobStatus.ACCEPTED, label: 'Accepted' },
  { key: JobStatus.ACTIVE, label: 'Active' },
  { key: JobStatus.COMPLETED, label: 'Completed' },
];

const STATUS_ORDER: JobStatus[] = [
  JobStatus.PENDING,
  JobStatus.ACCEPTED,
  JobStatus.ACTIVE,
  JobStatus.COMPLETED,
];

/** Maps terminal declined/cancelled states to -1 so the stepper shows the error banner instead. */
function getStepIndex(status: JobStatus): number {
  if (status === JobStatus.DECLINED || status === JobStatus.CANCELLED) {
    return -1;
  }
  return STATUS_ORDER.indexOf(status);
}

/** Visual timeline from pending through completed — hides steps for declined/cancelled jobs. */
export function JobStatusTimeline({ status }: JobStatusTimelineProps) {
  const currentIndex = getStepIndex(status);
  const isTerminal = status === JobStatus.DECLINED || status === JobStatus.CANCELLED;

  return (
    <View>
      {isTerminal ? (
        <View className="rounded-xl bg-red-50 px-4 py-3">
          <Text className="text-center text-sm font-semibold text-danger">
            Job {status === JobStatus.DECLINED ? 'declined' : 'cancelled'}
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center justify-between">
          {STEPS.map((step, index) => {
            const isComplete = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <View key={step.key} className="flex-1 items-center">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isComplete ? 'bg-primary' : 'bg-gray-200'
                  } ${isCurrent ? 'border-2 border-primary/30' : ''}`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isComplete ? 'text-white' : 'text-text-muted'
                    }`}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  className={`mt-2 text-center text-xs ${
                    isCurrent ? 'font-semibold text-primary' : 'text-text-secondary'
                  }`}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
