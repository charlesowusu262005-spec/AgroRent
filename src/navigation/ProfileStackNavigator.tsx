/**
 * @file        ProfileStackNavigator.tsx
 * @feature     Navigation
 * @description Shared profile stack: view profile, edit, and notifications (all roles).
 * @navigation  FarmerTab | OwnerTab | WorkerTab > Profile > ProfileStack
 * @data        ProfileStackParamList
 * @consumes    profile feature screens, header options
 * @author      MiStarStudio
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  EditProfileScreen,
  NotificationsScreen,
  ProfileScreen,
} from '../features/profile/screens';
import { backOnlyHeaderOptions, hiddenHeaderOptions } from './options';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * Profile settings stack reused across farmer, owner, and worker tab navigators.
 * WHY Profile as initial route: the tab always opens the summary screen; edit and
 * notifications are pushed modally with back affordance via backOnlyHeaderOptions.
 */
export function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={hiddenHeaderOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ ...backOnlyHeaderOptions, headerTitle: 'Edit Profile' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ ...backOnlyHeaderOptions, headerTitle: 'Notifications' }}
      />
    </Stack.Navigator>
  );
}
