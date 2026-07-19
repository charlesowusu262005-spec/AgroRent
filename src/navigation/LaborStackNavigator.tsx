/**
 * @file        LaborStackNavigator.tsx
 * @feature     Navigation
 * @description Shared labor stack: farmer worker search (Hub) vs worker job list (WorkerJobs).
 * @navigation  FarmerTab > LaborHub | WorkerTab > Jobs > LaborStack
 * @data        auth.role, LaborStackParamList (workerId, jobId, review targets)
 * @consumes    labor feature screens, SubmitReviewScreen, header options
 * @author      MiStarStudio
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppSelector } from '../app/hooks';
import {
  JobTrackingScreen,
  LaborRequestScreen,
  WorkerJobsScreen,
  WorkerProfileScreen,
  WorkerSearchScreen,
} from '../features/labor/screens';
import { SubmitReviewScreen } from '../features/reviews/screens';
import { backOnlyHeaderOptions, hiddenHeaderOptions } from './options';
import type { LaborStackParamList } from './types';

const Stack = createNativeStackNavigator<LaborStackParamList>();

/**
 * Labor marketplace stack mounted under farmer LaborHub or worker Jobs tab.
 * WHY role-based initial route: one navigator serves both personas; farmers hire from
 * Hub (worker search), workers manage assignments from WorkerJobs without duplicate stacks.
 */
export function LaborStackNavigator() {
  const role = useAppSelector((state) => state.auth.role);
  const initialRouteName = role === 'WORKER' ? 'WorkerJobs' : 'Hub';

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={hiddenHeaderOptions}>
      {/* ── Tab roots (role-dependent initial) ───────────────────────────── */}
      <Stack.Screen name="Hub" component={WorkerSearchScreen} />
      <Stack.Screen name="WorkerJobs" component={WorkerJobsScreen} />

      {/* ── Profiles & hiring ────────────────────────────────────────────── */}
      <Stack.Screen
        name="WorkerDetail"
        component={WorkerProfileScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="HireRequest"
        component={LaborRequestScreen}
        options={backOnlyHeaderOptions}
      />

      {/* ── Active jobs ──────────────────────────────────────────────────── */}
      <Stack.Screen
        name="JobDetail"
        component={JobTrackingScreen}
        options={backOnlyHeaderOptions}
      />

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <Stack.Screen
        name="SubmitReview"
        component={SubmitReviewScreen}
        options={{ ...backOnlyHeaderOptions, headerTitle: 'Write Review' }}
      />
    </Stack.Navigator>
  );
}
