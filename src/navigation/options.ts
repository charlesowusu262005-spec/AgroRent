/**
 * @file        options.ts
 * @feature     Navigation
 * @description Shared React Navigation screenOptions presets for headers and bottom tabs.
 * @navigation  Consumed by all stack and tab navigators in this folder
 * @data        theme colors (primary, background, surface, gray scale)
 * @consumes    ../constants/theme
 * @author      MiStarStudio
 */

import { colors } from '../constants/theme';

/** Stack screens with back chevron only — child screens supply title via options or in-screen UI. */
export const backOnlyHeaderOptions = {
  headerShown: true,
  headerTitle: '',
  headerBackTitleVisible: false,
  headerTintColor: colors.primary,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: colors.background,
  },
} as const;

/** Root and tab-root stacks where screens own the full layout (no native header). */
export const hiddenHeaderOptions = {
  headerShown: false,
} as const;

/** Default bottom tab styling aligned with AgroRent Ghana brand tokens. */
export const tabBarOptions = {
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.gray[400],
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.gray[200],
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
};
