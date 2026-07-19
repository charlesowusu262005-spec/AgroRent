/**
 * @file        InAppNotificationBanner.tsx
 * @feature     Core
 * @description Foreground push notification toast when FCM delivers while app is open.
 * @data        Redux `appUi.foregroundNotification` set by useAppBootstrap listener.
 * @consumes    appUiSlice, useSafeAreaInsets
 * @author      MiStarStudio
 */

import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearForegroundNotification } from '../app/slices/appUiSlice';

/**
 * Overlays a dismissible banner below the status bar (or below offline banner).
 * Auto-cleared by bootstrap after 4s; user can dismiss early via X.
 */
export function InAppNotificationBanner() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.appUi.foregroundNotification);
  const isOnline = useAppSelector((state) => state.network.isOnline);
  const insets = useSafeAreaInsets();

  if (!notification) return null;

  // Stack below offline banner so both messages remain visible
  const topOffset = isOnline ? insets.top : insets.top + 40;

  return (
    <View
      className="absolute left-3 right-3 z-50 rounded-xl bg-primary px-4 py-3 shadow-lg"
      style={{ top: topOffset }}
      accessibilityRole="alert"
      accessibilityLabel={`${notification.title}. ${notification.body}`}
    >
      <View className="flex-row items-start">
        <View className="flex-1 pr-2">
          <Text className="text-sm font-bold text-white">{notification.title}</Text>
          {notification.body ? (
            <Text className="mt-1 text-xs text-white/90" numberOfLines={2}>
              {notification.body}
            </Text>
          ) : null}
        </View>
        <Pressable
          onPress={() => dispatch(clearForegroundNotification())}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          hitSlop={8}
        >
          <X size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
