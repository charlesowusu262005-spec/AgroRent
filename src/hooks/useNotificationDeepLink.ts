/**
 * @file        useNotificationDeepLink.ts
 * @feature     Core
 * @description Bridges Redux pending deep links from push taps into React Navigation tab stacks.
 * @data        appUi.pendingDeepLink (NotificationLink)
 * @consumes    appUiSlice, TabBarWithDeepLink
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearPendingDeepLink } from '../app/slices/appUiSlice';

/** Consumes a pending push-notification deep link on the active tab navigator. */
export function useNotificationDeepLink(navigation: NavigationProp<ParamListBase>) {
  const dispatch = useAppDispatch();
  const pendingDeepLink = useAppSelector((state) => state.appUi.pendingDeepLink);

  useEffect(() => {
    if (!pendingDeepLink) return;

    navigation.navigate(
      pendingDeepLink.tab,
      {
        screen: pendingDeepLink.screen,
        params: pendingDeepLink.params,
      } as never,
    );
    dispatch(clearPendingDeepLink());
  }, [pendingDeepLink, navigation, dispatch]);
}
