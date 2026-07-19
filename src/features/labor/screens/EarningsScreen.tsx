/**
 * @file        EarningsScreen.tsx
 * @feature     Labor
 * @description Worker earnings dashboard with monthly totals and weekly bar chart.
 * @navigation  LaborStack > Earnings
 * @data        workerJobs (COMPLETED)
 * @author      MiStarStudio
 */

import { FlatList, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { format, parseISO, startOfMonth, isAfter } from 'date-fns';

import { Wallet } from 'lucide-react-native';

import { useAppSelector } from '../../../app/hooks';
import { Card, EmptyState, ScreenContainer } from '../../../components';
import { JobCard } from '../components';
import { JobStatus } from '../types/labor.types';

// TODO(api): replace with GET /labor/earnings/weekly — static chart data for demo
const WEEKLY_DATA = [
  { label: 'Mon', amount: 120 },
  { label: 'Tue', amount: 0 },
  { label: 'Wed', amount: 200 },
  { label: 'Thu', amount: 80 },
  { label: 'Fri', amount: 320 },
  { label: 'Sat', amount: 160 },
  { label: 'Sun', amount: 0 },
];

/** Simple SVG bar chart for weekly earnings — heights scale relative to max bar. */
function WeeklyEarningsChart() {
  const max = Math.max(...WEEKLY_DATA.map((d) => d.amount), 1);
  const chartHeight = 120;
  const barWidth = 28;

  return (
    <View className="mt-4">
      <Svg width="100%" height={chartHeight + 24} viewBox="0 0 280 144">
        {WEEKLY_DATA.map((item, index) => {
          const barHeight = (item.amount / max) * chartHeight;
          const x = index * 40 + 8;
          const y = chartHeight - barHeight;
          return (
            <Rect
              key={item.label}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={6}
              fill={item.amount > 0 ? '#1A6B3A' : '#E5E7EB'}
            />
          );
        })}
      </Svg>
      <View className="flex-row justify-between px-1">
        {WEEKLY_DATA.map((item) => (
          <Text key={item.label} className="w-10 text-center text-xs text-text-muted">
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

/** Worker earnings summary — month/all-time totals derived from completed jobs in Redux. */
export function EarningsScreen() {
  const jobs = useAppSelector((state) => state.labor.workerJobs).filter(
    (j) => j.status === JobStatus.COMPLETED,
  );

  const monthStart = startOfMonth(new Date());
  const monthTotal = jobs
    .filter((j) => isAfter(parseISO(j.jobDate), monthStart) || j.jobDate === format(monthStart, 'yyyy-MM-dd'))
    .reduce((sum, j) => sum + j.agreedAmount, 0);
  const allTimeTotal = jobs.reduce((sum, j) => sum + j.agreedAmount, 0);

  return (
    <ScreenContainer className="px-0">
      <View className="px-4 pb-2 pt-2">
        <Text className="text-2xl font-bold text-text-primary">Earnings</Text>
      </View>

      <View className="px-4">
        {/* ─── Summary card & chart ─── */}
        <Card padding="md">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-text-secondary">This month</Text>
              <Text className="mt-1 text-2xl font-bold text-primary">GHS {monthTotal}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-text-secondary">All time</Text>
              <Text className="mt-1 text-2xl font-bold text-text-primary">GHS {allTimeTotal}</Text>
            </View>
          </View>
          <Text className="mb-1 mt-4 text-sm font-semibold text-text-primary">Weekly earnings</Text>
          <WeeklyEarningsChart />
        </Card>

        <Text className="mb-3 mt-6 text-lg font-semibold text-text-primary">Completed jobs</Text>
      </View>

      {/* ─── Completed jobs list ─── */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6"
        ListEmptyComponent={
          <EmptyState
            icon={<Wallet size={32} color="#9CA3AF" />}
            title="No completed jobs yet"
            subtitle="Earnings from finished jobs will show up here"
          />
        }
        renderItem={({ item }) => <JobCard job={item} variant="completed" />}
      />
    </ScreenContainer>
  );
}
