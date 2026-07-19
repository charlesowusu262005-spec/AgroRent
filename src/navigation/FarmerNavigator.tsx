/**
 * @file        FarmerNavigator.tsx
 * @feature     Navigation
 * @description Bottom-tab shell for farmers: home, equipment search, bookings, labor hub, profile.
 * @navigation  RootStack > Main > FarmerTab
 * @data        FarmerTabParamList (nested stack params per tab)
 * @consumes    feature stacks, TabBarWithDeepLink, tabBarOptions, lucide icons
 * @author      MiStarStudio
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Calendar,
  Home,
  Search,
  User,
  Users,
} from 'lucide-react-native';

import { FarmerHomeScreen } from '../features/dashboard/screens';
import { BookingStackNavigator } from './BookingStackNavigator';
import { EquipmentStackNavigator } from './EquipmentStackNavigator';
import { LaborStackNavigator } from './LaborStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { TabBarWithDeepLink } from './TabBarWithDeepLink';
import { tabBarOptions } from './options';
import type { FarmerTabParamList } from './types';

const Tab = createBottomTabNavigator<FarmerTabParamList>();

/**
 * Farmer persona tab navigator — five tabs with nested stacks where needed.
 * WHY TabBarWithDeepLink: push notifications target tab + nested screen; the custom
 * tab bar runs useNotificationDeepLink so cold/warm opens land on the right stack screen.
 */
export function FarmerNavigator() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions} tabBar={(props) => <TabBarWithDeepLink {...props} />}>
      <Tab.Screen
        name="Home"
        component={FarmerHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={EquipmentStackNavigator}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingStackNavigator}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="LaborHub"
        component={LaborStackNavigator}
        options={{
          tabBarLabel: 'Labor',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
