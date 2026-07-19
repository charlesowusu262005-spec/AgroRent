/**
 * @file        EquipmentStackNavigator.tsx
 * @feature     Navigation
 * @description Nested stack for browsing, comparing, and managing equipment listings (farmer Search tab).
 * @navigation  FarmerTab > Search > EquipmentStack
 * @data        EquipmentStackParamList (equipmentId, equipmentIds, review targets)
 * @consumes    equipment feature screens, SubmitReviewScreen, header options
 * @author      MiStarStudio
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AddEquipmentScreen,
  EditEquipmentScreen,
  EquipmentCompareScreen,
  EquipmentDetailScreen,
  EquipmentMapScreen,
  EquipmentSearchScreen,
} from '../features/equipment/screens';
import { SubmitReviewScreen } from '../features/reviews/screens';
import { backOnlyHeaderOptions, hiddenHeaderOptions } from './options';
import type { EquipmentStackParamList } from './types';

const Stack = createNativeStackNavigator<EquipmentStackParamList>();

/** Equipment discovery and detail flow mounted under the farmer Search tab. */
export function EquipmentStackNavigator() {
  return (
    <Stack.Navigator
      // WHY Search as initial route: tab label is "Search"; opening the tab should show
      // the catalog immediately, not Map or a stale detail from a previous session.
      initialRouteName="Search"
      screenOptions={hiddenHeaderOptions}
    >
      {/* ── Browse ───────────────────────────────────────────────────────── */}
      <Stack.Screen name="Search" component={EquipmentSearchScreen} />
      <Stack.Screen name="Map" component={EquipmentMapScreen} />
      <Stack.Screen
        name="Detail"
        component={EquipmentDetailScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="Compare"
        component={EquipmentCompareScreen}
        options={backOnlyHeaderOptions}
      />

      {/* ── Owner actions (also reachable from owner listings stack) ─────── */}
      <Stack.Screen
        name="AddEquipment"
        component={AddEquipmentScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="EditEquipment"
        component={EditEquipmentScreen}
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
