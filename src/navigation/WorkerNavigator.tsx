/**
 * @file        WorkerNavigator.tsx
 * @feature     Navigation
 * @description Bottom-tab shell for agricultural workers: dashboard, jobs, earnings, profile.
 * @navigation  RootStack > Main > WorkerTab
 * @data        WorkerTabParamList (nested stack params per tab)
 * @consumes    LaborStackNavigator, ProfileStackNavigator, EarningsScreen, TabBarWithDeepLink
 * @author      MiStarStudio
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Briefcase, LayoutDashboard, User, Wallet } from 'lucide-react-native';

import { WorkerDashboardScreen } from '../features/dashboard/screens';
import { EarningsScreen } from '../features/labor/screens';
import { LaborStackNavigator } from './LaborStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { TabBarWithDeepLink } from './TabBarWithDeepLink';
import { tabBarOptions } from './options';
import type { WorkerTabParamList } from './types';

const Tab = createBottomTabNavigator<WorkerTabParamList>();

/**
 * Worker persona tab navigator — jobs stack reuses LaborStack with worker-first initial route.
 * WHY TabBarWithDeepLink: job-offer and payment pushes must switch to Jobs tab and drill
 * into WorkerJobs or JobDetail without the user manually finding the right tab.
 */
export function WorkerNavigator() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions} tabBar={(props) => <TabBarWithDeepLink {...props} />}>
      <Tab.Screen
        name="Dashboard"
        component={WorkerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={LaborStackNavigator}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
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
