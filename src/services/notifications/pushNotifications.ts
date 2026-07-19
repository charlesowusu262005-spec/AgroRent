/**
 * @file        pushNotifications.ts
 * @feature     Notifications
 * @description Expo push permission flow, Android channel setup, FCM token registration, and deep-link parsing.
 * @data        Expo push token, notification payload `data.type` (BOOKING | JOB | PAYMENT)
 * @consumes    profileSlice.registerFcmToken
 * @author      MiStarStudio
 */

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { AppDispatch } from '../../app/store';
import { registerFcmToken } from '../../features/profile/slices/profileSlice';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Requests OS permission on physical devices, configures Android channel, and dispatches FCM token. */
export async function requestNotificationPermissionAndRegister(
  dispatch: AppDispatch,
): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'AgroRent',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  void dispatch(registerFcmToken(token));

  return token;
}

/** Maps push `data` payload to a tab/screen navigation target; returns null for unknown types. */
export function parseNotificationDeepLink(
  data: Record<string, unknown> | undefined,
): { tab: string; screen: string; params?: Record<string, unknown> } | null {
  if (!data?.type) return null;

  switch (data.type) {
    case 'BOOKING':
      return {
        tab: 'Bookings',
        screen: 'Detail',
        params: { bookingId: data.bookingId as string },
      };
    case 'JOB':
      return {
        tab: data.role === 'worker' ? 'Jobs' : 'LaborHub',
        screen: 'JobDetail',
        params: { jobId: data.jobId as string, viewerRole: data.role ?? 'farmer' },
      };
    case 'PAYMENT':
      return {
        tab: 'Bookings',
        screen: 'PaymentStatus',
        params: { paymentId: data.paymentId as string },
      };
    default:
      return null;
  }
}
