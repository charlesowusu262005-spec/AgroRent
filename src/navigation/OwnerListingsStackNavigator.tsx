/**
 * @file        OwnerListingsStackNavigator.tsx
 * @feature     Navigation
 * @description Owner-only stack for managing equipment listings (CRUD).
 * @navigation  OwnerTab > Listings > OwnerListingsStack
 * @data        OwnerListingsStackParamList (equipmentId on edit)
 * @consumes    equipment feature screens (OwnerListings, Add, Edit), header options
 * @author      MiStarStudio
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AddEquipmentScreen,
  EditEquipmentScreen,
  OwnerListingsScreen,
} from '../features/equipment/screens';
import { backOnlyHeaderOptions, hiddenHeaderOptions } from './options';
import type { OwnerListingsStackParamList } from './types';

const Stack = createNativeStackNavigator<OwnerListingsStackParamList>();

/**
 * Owner listings management stack — separate from farmer EquipmentStack to keep
 * owner IA focused on "my inventory" rather than marketplace search.
 * WHY MyListings initial: Listings tab should show owned equipment grid immediately.
 */
export function OwnerListingsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MyListings" screenOptions={hiddenHeaderOptions}>
      <Stack.Screen name="MyListings" component={OwnerListingsScreen} />
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
    </Stack.Navigator>
  );
}
