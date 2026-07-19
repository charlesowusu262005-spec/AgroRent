/**
 * @file        OwnerNavigator.tsx
 * @feature     Navigation
 * @description Bottom-tab shell for equipment owners: dashboard, listings, bookings, profile.
 * @navigation  RootStack > Main > OwnerTab
 * @data        OwnerTabParamList (nested stack params per tab)
 * @consumes    OwnerListingsStackNavigator, BookingStackNavigator, ProfileStackNavigator, TabBarWithDeepLink
 * @author      MiStarStudio
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, LayoutDashboard, Package, User } from 'lucide-react-native';

import { OwnerDashboardScreen } from '../features/dashboard/screens';
import { BookingStackNavigator } from './BookingStackNavigator';
import { OwnerListingsStackNavigator } from './OwnerListingsStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { TabBarWithDeepLink } from './TabBarWithDeepLink';
import { tabBarOptions } from './options';
import type { OwnerTabParamList } from './types';

const Tab = createBottomTabNavigator<OwnerTabParamList>();

/**
 * Owner persona tab navigator — dashboard-first IA without farmer-only Search/Labor tabs.
 * WHY TabBarWithDeepLink: same push deep-link contract as Farmer/Worker so notification
 * payloads can open Listings or Bookings nested screens regardless of role.
 */
export function OwnerNavigator() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions} tabBar={(props) => <TabBarWithDeepLink {...props} />}>
      <Tab.Screen
        name="Dashboard"
        component={OwnerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Listings"
        component={OwnerListingsStackNavigator}
        options={{
          tabBarLabel: 'Listings',
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
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
