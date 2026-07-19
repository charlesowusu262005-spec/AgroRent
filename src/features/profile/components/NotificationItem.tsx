/**
 * @file        NotificationItem.tsx
 * @feature     Profile
 * @description Single notification row with type icon, read/unread styling, and relative timestamp.
 * @author      MiStarStudio
 */

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  Briefcase,
  Calendar,
  CreditCard,
  Star,
} from 'lucide-react-native';

import type { AppNotification, NotificationType } from '../types/profile.types';

const ICON_MAP: Record<NotificationType, typeof Bell> = {
  BOOKING: Calendar,
  JOB: Briefcase,
  PAYMENT: CreditCard,
  REVIEW: Star,
  SYSTEM: Bell,
};

/** Props for one tappable notification list row. */
export interface NotificationItemProps {
  notification: AppNotification;
  onPress: () => void;
}

/** Renders icon, title, body preview, unread dot, and time-ago label. */
function NotificationItemComponent({ notification, onPress }: NotificationItemProps) {
  const Icon = ICON_MAP[notification.type];
  const relativeTime = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.read ? 'Read' : 'Unread'}`}
      className={`flex-row border-b border-gray-100 px-4 py-4 active:bg-gray-50 ${
        notification.read ? 'bg-surface' : 'bg-primary/5'
      }`}
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon size={20} color="#1A6B3A" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 pr-2 text-sm font-semibold text-text-primary">
            {notification.title}
          </Text>
          {!notification.read ? (
            <View className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
          ) : null}
        </View>
        <Text className="mt-1 text-sm text-text-secondary" numberOfLines={2}>
          {notification.body}
        </Text>
        <Text className="mt-2 text-xs text-text-muted">{relativeTime}</Text>
      </View>
    </Pressable>
  );
}

export const NotificationItem = memo(NotificationItemComponent);
