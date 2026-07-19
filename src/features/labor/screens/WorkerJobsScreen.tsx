/**
 * @file        WorkerJobsScreen.tsx
 * @feature     Labor
 * @description Worker tab listing all assigned and incoming hire jobs.
 * @navigation  LaborStack > WorkerJobs
 * @data        workerJobs
 * @author      MiStarStudio
 */

import { FlatList, RefreshControl, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Briefcase } from 'lucide-react-native';

import { useAppSelector } from '../../../app/hooks';
import { EmptyState, ScreenContainer } from '../../../components';
import type { LaborStackParamList } from '../../../navigation/types';
import { JobCard } from '../components';

type Props = NativeStackScreenProps<LaborStackParamList, 'WorkerJobs'>;

/** Worker-side job inbox — refresh is a no-op until fetchWorkerJobs API is wired. */
export function WorkerJobsScreen({ navigation }: Props) {
  const allJobs = useAppSelector((state) => state.labor.workerJobs);

  return (
    <ScreenContainer className="px-0">
      <View className="px-4 pb-2 pt-2">
        <Text className="text-2xl font-bold text-text-primary">My Jobs</Text>
      </View>
      <FlatList
        data={allJobs}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6 grow"
        refreshControl={<RefreshControl tintColor="#1A6B3A" onRefresh={() => {}} refreshing={false} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Briefcase size={32} color="#9CA3AF" />}
            title="No jobs yet"
            subtitle="Incoming hire requests will appear here"
          />
        }
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() =>
              navigation.navigate('JobDetail', { jobId: item.id, viewerRole: 'worker' })
            }
          />
        )}
      />
    </ScreenContainer>
  );
}
