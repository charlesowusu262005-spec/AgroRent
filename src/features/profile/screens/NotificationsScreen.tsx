/**
 * @file        NotificationsScreen.tsx
 * @feature     Profile
 * @description Notification inbox with mark-read, mark-all-read, and deep-link navigation on tap.
 * @navigation  ProfileStack > Notifications
 * @data        fetchNotifications, markNotificationRead, markAllNotificationsRead
 * @consumes    NotificationItem, EmptyState
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EmptyState, LoadingSpinner, ScreenContainer } from '../../../components';
import type {
  FarmerTabParamList,
  OwnerTabParamList,
  ProfileStackParamList,
  WorkerTabParamList,
} from '../../../navigation/types';
import { NotificationItem } from '../components';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../slices/profileSlice';
import type { AppNotification } from '../types/profile.types';
import { Bell } from 'lucide-react-native';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Notifications'>;

/** Lists user notifications with unread count header and tab deep-link on press. */
export function NotificationsScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { notifications, isLoading } = useAppSelector((state) => state.profile);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const tabNavigation = navigation.getParent<
    BottomTabNavigationProp<FarmerTabParamList & OwnerTabParamList & WorkerTabParamList>
  >();

  useEffect(() => {
    void dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationPress = (notification: AppNotification) => {
    if (!notification.read) {
      void dispatch(markNotificationRead(notification.id));
    }

    if (notification.link && tabNavigation) {
      const { tab, screen, params } = notification.link;
      tabNavigation.navigate(tab as 'Bookings', {
        screen,
        params,
      } as never);
    }
  };

  const handleMarkAllRead = () => {
    void dispatch(markAllNotificationsRead());
  };

  if (isLoading && notifications.length === 0) {
    return <LoadingSpinner label="Loading notifications..." />;
  }

  return (
    <ScreenContainer className="px-0">
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <Text className="text-sm text-text-secondary">
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        </Text>
        {unreadCount > 0 ? (
          <Pressable onPress={handleMarkAllRead} accessibilityRole="button">
            <Text className="text-sm font-semibold text-primary">Mark all as read</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerClassName="grow pb-6"
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={32} color="#9CA3AF" />}
            title="No notifications"
            subtitle="Updates about bookings, jobs, and payments will appear here"
          />
        }
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
      />
    </ScreenContainer>
  );
}
