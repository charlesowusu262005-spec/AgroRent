/**
 * @file        WorkerDashboardScreen.tsx
 * @feature     Dashboard
 * @description Worker home tab — availability toggle, weekly earnings, quick actions, and incoming job requests.
 * @navigation  WorkerTab > Dashboard (initialRoute)
 * @data        labor slice (incomingJobs, workerProfile, workerJobs)
 * @consumes    AvailabilityToggle, QuickActions, Card, EmptyState
 * @author      MiStarStudio
 */

import { FlatList, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Briefcase, Pencil, Wallet } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, Card, EmptyState, ScreenContainer } from '../../../components';
import type { WorkerTabParamList } from '../../../navigation/types';
import { AvailabilityToggle, JobCard } from '../../labor/components';
import { acceptJob, declineJob, setWorkerAvailability } from '../../labor/slices/laborSlice';
import { JobStatus } from '../../labor/types/labor.types';
import { QuickActions } from '../components';
import { getTimeGreeting } from '../utils/greeting';

type Props = BottomTabScreenProps<WorkerTabParamList, 'Dashboard'>;

/** Worker role dashboard with availability, earnings summary, and pending hire requests. */
export function WorkerDashboardScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  // TODO(api): replace with GET /dashboard/worker-summary — weekJobsCount, weekEarnings, incomingJobs[]
  const user = useAppSelector((state) => state.auth.user);
  const { incomingJobs, workerProfile, workerJobs } = useAppSelector((state) => state.labor);

  const displayName = workerProfile?.name ?? user?.name ?? 'Worker';
  const weekJobs = workerJobs.filter(
    (job) => job.status === JobStatus.ACTIVE || job.status === JobStatus.COMPLETED,
  );
  const weekEarnings = weekJobs
    .filter((job) => job.status === JobStatus.COMPLETED)
    .reduce((sum, job) => sum + job.agreedAmount, 0);

  const quickActions = [
    {
      id: 'view-jobs',
      label: 'View Jobs',
      icon: <Briefcase size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('Jobs', { screen: 'WorkerJobs' }),
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: <Wallet size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('Earnings', undefined),
    },
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: <Pencil size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('Profile', { screen: 'EditProfile' }),
    },
  ];

  return (
    <ScreenContainer className="px-0">
      <View className="px-4 pb-2 pt-2">
        <Text className="text-2xl font-bold text-text-primary">
          {getTimeGreeting()}, {displayName.split(' ')[0]}
        </Text>
        <Text className="mt-1 text-sm text-text-secondary">Manage your availability and requests</Text>
      </View>

      <View className="px-4">
        <AvailabilityToggle
          available={workerProfile?.available ?? true}
          onChange={(value) => dispatch(setWorkerAvailability(value))}
        />

        <View className="mt-4">
          <Card padding="md">
          <Text className="text-sm text-text-secondary">This week&apos;s earnings</Text>
          <Text className="mt-1 text-3xl font-bold text-primary">GHS {weekEarnings}</Text>
          <Text className="mt-1 text-sm text-text-secondary">
            {weekJobs.length} job{weekJobs.length === 1 ? '' : 's'} this week
          </Text>
          </Card>
        </View>

        <Text className="mb-3 mt-6 text-lg font-semibold text-text-primary">Quick Actions</Text>
        <QuickActions actions={quickActions} columns={2} />
        <Text className="mb-3 mt-6 text-lg font-semibold text-text-primary">Incoming requests</Text>
      </View>

      <FlatList
        data={incomingJobs}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6 grow"
        ListEmptyComponent={
          <EmptyState
            icon={<Briefcase size={32} color="#9CA3AF" />}
            title="No pending requests"
            subtitle="New hire requests from farmers will appear here"
          />
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            variant="incoming"
            footer={
              item.status === JobStatus.PENDING ? (
                <View className="mt-3 flex-row gap-2">
                  <View className="flex-1">
                    <Button
                      label="Accept"
                      onPress={() => void dispatch(acceptJob(item.id))}
                      fullWidth
                    />
                  </View>
                  <View className="flex-1">
                    <Button
                      label="Decline"
                      variant="danger"
                      onPress={() => void dispatch(declineJob(item.id))}
                      fullWidth
                    />
                  </View>
                </View>
              ) : null
            }
          />
        )}
      />
    </ScreenContainer>
  );
}
