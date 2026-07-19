/**
 * @file        networkSlice.ts
 * @feature     Core
 * @description Tracks device connectivity for OfflineBanner and offline-first UX decisions.
 * @data        NetInfo listener via useAppBootstrap
 * @consumes    OfflineBanner
 * @author      MiStarStudio
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Online flag plus timestamp of the last connectivity change. */
export interface NetworkState {
  isOnline: boolean;
  lastChangedAt: number | null;
}

const initialState: NetworkState = {
  isOnline: true,
  lastChangedAt: null,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      state.lastChangedAt = Date.now();
    },
  },
});

export const { setNetworkStatus } = networkSlice.actions;
export default networkSlice.reducer;
