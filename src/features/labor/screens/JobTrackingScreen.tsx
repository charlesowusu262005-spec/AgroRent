/**
 * @file        JobTrackingScreen.tsx
 * @feature     Labor
 * @description Job detail with timeline, contact info, and role-specific action buttons.
 * @navigation  LaborStack > JobDetail
 * @data        jobId route param, viewerRole route param
 * @consumes    JobStatusTimeline, acceptJob, declineJob, startJob, completeJob
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Phone, User } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, Card, ScreenContainer } from '../../../components';
import type { LaborStackParamList } from '../../../navigation/types';
import { JobStatusTimeline } from '../components';
import { acceptJob, completeJob, declineJob, startJob } from '../slices/laborSlice';
import { JobStatus } from '../types/labor.types';

type Props = NativeStackScreenProps<LaborStackParamList, 'JobDetail'>;

/** Shared job detail for farmer and worker — actions differ by viewerRole and status. */
export function JobTrackingScreen({ route }: Props) {
  const { jobId, viewerRole = 'farmer' } = route.params;
  const dispatch = useAppDispatch();
  const job = useAppSelector(
    (state) =>
      state.labor.myJobs.find((j) => j.id === jobId) ??
      state.labor.workerJobs.find((j) => j.id === jobId) ??
      state.labor.incomingJobs.find((j) => j.id === jobId),
  );

  if (!job) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">Job not found</Text>
      </ScreenContainer>
    );
  }

  const isWorker = viewerRole === 'worker';
  const contactName = isWorker ? job.farmerName : job.workerName;
  const canAcceptDecline = isWorker && job.status === JobStatus.PENDING;
  const canStartJob = !isWorker && job.status === JobStatus.ACCEPTED;
  const canMarkComplete = !isWorker && job.status === JobStatus.ACTIVE;

  return (
    <ScreenContainer scrollable accessibilityLabel="Job tracking">
      <Text className="mb-2 text-2xl font-bold text-text-primary">{job.serviceType}</Text>
      <Text className="mb-6 text-base text-text-secondary">{job.locationName}</Text>

      <Card padding="md">
        <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Job progress
        </Text>
        <JobStatusTimeline status={job.status} />
      </Card>

      <View className="mt-6 gap-3">
        <InfoRow label="Date" value={job.jobDate} />
        <InfoRow label="Amount" value={`GHS ${job.agreedAmount}`} />
        <InfoRow label="Status" value={job.status} />
      </View>

      <Card padding="md">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Contact
        </Text>
        <View className="flex-row items-center">
          <View className="rounded-full bg-primary/10 p-2">
            <User size={20} color="#1A6B3A" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-text-primary">{contactName}</Text>
            <View className="mt-1 flex-row items-center">
              <Phone size={14} color="#6B7280" />
              {/* TODO(api): replace with contact phone from job detail endpoint */}
              <Text className="ml-1 text-sm text-text-secondary">+233 24 000 0000</Text>
            </View>
          </View>
        </View>
      </Card>

      {job.notes ? (
        <View className="mt-4 rounded-xl bg-gray-50 p-4">
          <Text className="text-sm font-medium text-text-primary">Notes</Text>
          <Text className="mt-1 text-sm text-text-secondary">{job.notes}</Text>
        </View>
      ) : null}

      {/* ─── Role-specific actions ─── */}
      <View className="mt-6 gap-3 pb-6">
        {canAcceptDecline ? (
          <>
            <Button label="Accept Job" onPress={() => void dispatch(acceptJob(jobId))} fullWidth />
            <Button
              label="Decline Job"
              variant="danger"
              onPress={() => void dispatch(declineJob(jobId))}
              fullWidth
            />
          </>
        ) : null}
        {canStartJob ? (
          <Button label="Start Job" onPress={() => void dispatch(startJob(jobId))} fullWidth />
        ) : null}
        {canMarkComplete ? (
          <Button
            label="Mark Complete"
            onPress={() => void dispatch(completeJob(jobId))}
            fullWidth
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}

/** Single label/value row for job metadata fields. */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-surface px-4 py-3">
      <Text className="text-sm text-text-secondary">{label}</Text>
      <Text className="text-sm font-semibold text-text-primary">{value}</Text>
    </View>
  );
}
