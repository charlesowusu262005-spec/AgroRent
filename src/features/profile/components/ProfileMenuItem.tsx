/**
 * @file        ProfileMenuItem.tsx
 * @feature     Profile
 * @description Tappable settings row with icon, optional badge, and chevron for profile menus.
 * @author      MiStarStudio
 */

import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

/** Props for a profile settings list row. */
export interface ProfileMenuItemProps {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  badge?: string;
}

/** Standard menu row; destructive variant omits chevron and uses danger text color. */
export function ProfileMenuItem({
  icon,
  label,
  onPress,
  destructive = false,
  badge,
}: ProfileMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center border-b border-gray-100 px-4 py-4 active:bg-gray-50"
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </View>
      <Text
        className={`flex-1 text-base font-medium ${
          destructive ? 'text-danger' : 'text-text-primary'
        }`}
      >
        {label}
      </Text>
      {badge ? (
        <View className="mr-2 rounded-full bg-danger px-2 py-0.5">
          <Text className="text-xs font-bold text-white">{badge}</Text>
        </View>
      ) : null}
      {!destructive ? <ChevronRight size={20} color="#9CA3AF" /> : null}
    </Pressable>
  );
}
