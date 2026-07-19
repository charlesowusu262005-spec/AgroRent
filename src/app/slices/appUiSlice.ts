/**
 * @file        appUiSlice.ts
 * @feature     Core
 * @description Transient UI state for push deep links and in-app foreground notification banners.
 * @data        NotificationLink, ForegroundNotification
 * @consumes    InAppNotificationBanner, useAppBootstrap, useNotificationDeepLink
 * @author      MiStarStudio
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { NotificationLink } from '../../features/profile/types/profile.types';

/** Payload shown in InAppNotificationBanner while app is foregrounded. */
export interface ForegroundNotification {
  title: string;
  body: string;
}

/** Redux slice holding navigation and banner UI state outside feature domains. */
export interface AppUiState {
  pendingDeepLink: NotificationLink | null;
  foregroundNotification: ForegroundNotification | null;
}

const initialState: AppUiState = {
  pendingDeepLink: null,
  foregroundNotification: null,
};

const appUiSlice = createSlice({
  name: 'appUi',
  initialState,
  reducers: {
    setPendingDeepLink: (state, action: PayloadAction<NotificationLink | null>) => {
      state.pendingDeepLink = action.payload;
    },
    clearPendingDeepLink: (state) => {
      state.pendingDeepLink = null;
    },
    showForegroundNotification: (state, action: PayloadAction<ForegroundNotification>) => {
      state.foregroundNotification = action.payload;
    },
    clearForegroundNotification: (state) => {
      state.foregroundNotification = null;
    },
  },
});

export const {
  setPendingDeepLink,
  clearPendingDeepLink,
  showForegroundNotification,
  clearForegroundNotification,
} = appUiSlice.actions;

export default appUiSlice.reducer;
