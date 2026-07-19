/**
 * @file        useAppBootstrap.ts
 * @feature     Core
 * @description App-wide side effects: offline cache hydration, connectivity, push setup, and notification listeners.
 * @data        AsyncStorage cache keys, NetInfo, Expo Notifications, profile FCM token
 * @consumes    hydrateOfflineCache, pushNotifications, networkSlice, appUiSlice, profileSlice
 * @author      MiStarStudio
 */

import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setNetworkStatus } from '../app/slices/networkSlice';
import {
  clearForegroundNotification,
  setPendingDeepLink,
  showForegroundNotification,
} from '../app/slices/appUiSlice';
import { fetchProfile } from '../features/profile/slices/profileSlice';
import { hydrateOfflineCache } from '../services/cache/hydrateCache';
import {
  parseNotificationDeepLink,
  requestNotificationPermissionAndRegister,
} from '../services/notifications/pushNotifications';

/** Mount once in AppShell — hydrates cache, tracks network, registers push when authenticated. */
export function useAppBootstrap() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const pushRegistered = useRef(false);

  useEffect(() => {
    void hydrateOfflineCache(dispatch);

    const unsubscribeNet = NetInfo.addEventListener((state) => {
      dispatch(setNetworkStatus(state.isConnected ?? true));
    });

    return () => unsubscribeNet();
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || pushRegistered.current) return;

    pushRegistered.current = true;
    void (async () => {
      await dispatch(fetchProfile());
      await requestNotificationPermissionAndRegister(dispatch);
    })();
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      if (title) {
        dispatch(showForegroundNotification({ title, body: body ?? '' }));
        setTimeout(() => dispatch(clearForegroundNotification()), 4000);
      }
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const link = parseNotificationDeepLink(
        response.notification.request.content.data as Record<string, unknown>,
      );
      if (link) {
        dispatch(setPendingDeepLink(link));
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [dispatch]);
}
