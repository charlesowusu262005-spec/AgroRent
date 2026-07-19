/**
 * @file        LaborRequestScreen.tsx
 * @feature     Labor
 * @description Farmer form to submit a hire request to a selected worker.
 * @navigation  LaborStack > HireRequest
 * @data        workerId route param, JobRequestFormValues
 * @consumes    JobRequestForm, createJob, mockLaborData
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Avatar, Button, ScreenContainer } from '../../../components';
import type { LaborStackParamList } from '../../../navigation/types';
import { JobRequestForm, type JobRequestFormValues } from '../components';
import { getWorkerById } from '../data/mockLaborData';
import { createJob } from '../slices/laborSlice';

type Props = NativeStackScreenProps<LaborStackParamList, 'HireRequest'>;

const INITIAL: JobRequestFormValues = {
  serviceType: '',
  jobDate: '',
  locationName: '',
  agreedAmount: '',
  notes: '',
};

/** Hire request submission — navigates to job tracking on success. */
export function LaborRequestScreen({ navigation, route }: Props) {
  const { workerId } = route.params;
  const worker = getWorkerById(workerId);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.labor.isLoading);
  const [values, setValues] = useState<JobRequestFormValues>(INITIAL);

  if (!worker) return null;

  const update = <K extends keyof JobRequestFormValues>(key: K, value: JobRequestFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!values.serviceType || !values.jobDate || !values.locationName || !values.agreedAmount) {
      Alert.alert('Incomplete form', 'Please fill all required fields.');
      return;
    }

    const result = await dispatch(
      createJob({
        workerId: worker.userId,
        workerName: worker.name,
        serviceType: values.serviceType,
        jobDate: values.jobDate,
        locationName: values.locationName,
        agreedAmount: Number(values.agreedAmount),
        notes: values.notes.trim() || undefined,
        farmerId: user?.id ?? 'farmer-1',
        farmerName: user?.name ?? 'Demo User',
      }),
    );

    if (createJob.fulfilled.match(result)) {
      Alert.alert('Request sent', 'The worker will respond to your hire request.', [
        {
          text: 'View job',
          onPress: () =>
            navigation.replace('JobDetail', {
              jobId: result.payload.id,
              viewerRole: 'farmer',
            }),
        },
      ]);
    }
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Hire request form">
      <Text className="mb-4 text-2xl font-bold text-text-primary">Send hire request</Text>

      <View className="mb-6 flex-row items-center rounded-2xl border border-gray-200 bg-surface p-3">
        <Avatar name={worker.name} imageUrl={worker.avatarUrl} size="md" />
        <View className="ml-3">
          <Text className="text-base font-semibold text-text-primary">{worker.name}</Text>
          <Text className="text-sm text-text-secondary">GHS {worker.hourlyRate}/hour</Text>
        </View>
      </View>

      <JobRequestForm values={values} onChange={update} hourlyRate={worker.hourlyRate} />

      <View className="mt-8 mb-6">
        <Button label="Send Request" onPress={handleSubmit} loading={isLoading} fullWidth />
      </View>
    </ScreenContainer>
  );
}
