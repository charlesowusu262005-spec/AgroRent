/**
 * @file        TabBarWithDeepLink.tsx
 * @feature     Navigation
 * @description Custom bottom tab bar that consumes pending push-notification deep links.
 * @navigation  Injected as tabBar on Farmer | Owner | Worker tab navigators
 * @data        appUi.pendingDeepLink (via useNotificationDeepLink)
 * @consumes    useNotificationDeepLink, @react-navigation/bottom-tabs BottomTabBar
 * @author      MiStarStudio
 */

import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { useNotificationDeepLink } from '../hooks/useNotificationDeepLink';

/**
 * Drop-in replacement for the default BottomTabBar on all role tab navigators.
 * WHY custom tab bar (not a screen effect): deep links must run where tab navigation
 * is in scope; mounting the hook here guarantees every persona tab shell handles pushes
 * the same way while still rendering the stock tab UI.
 */
export function TabBarWithDeepLink(props: BottomTabBarProps) {
  useNotificationDeepLink(props.navigation as unknown as NavigationProp<ParamListBase>);
  return <BottomTabBar {...props} />;
}
