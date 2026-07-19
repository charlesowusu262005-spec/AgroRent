/**
 * @file        QuickActions.tsx
 * @feature     Dashboard
 * @description Grid of icon buttons for common navigation shortcuts on role dashboards.
 * @author      MiStarStudio
 */

import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

/** Single shortcut entry with icon, label, and press handler. */
export interface QuickActionConfig {
  id: string;
  label: string;
  icon: ReactNode;
  onPress: () => void;
}

export interface QuickActionsProps {
  actions: QuickActionConfig[];
  columns?: 2 | 4;
}

/** Renders a 2- or 4-column grid of tappable action tiles. */
export function QuickActions({ actions, columns = 4 }: QuickActionsProps) {
  const widthClass = columns === 4 ? 'w-1/4' : 'w-1/2';

  return (
    <View className="flex-row flex-wrap">
      {actions.map((action) => (
        <Pressable
          key={action.id}
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className={`${widthClass} mb-4 items-center px-1 active:opacity-80`}
        >
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            {action.icon}
          </View>
          <Text className="mt-2 text-center text-xs font-medium text-text-primary" numberOfLines={2}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
