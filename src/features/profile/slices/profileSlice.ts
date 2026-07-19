/**
 * @file        profileSlice.ts
 * @feature     Profile
 * @description Redux state for user profile, notifications, and session actions (logout, FCM token).
 * @data        ProfileState, fetchProfile, updateProfile, fetchNotifications, logoutUser
 * @consumes    mockNotificationData, buildProfile, auth slice, cache/storage
 * @author      MiStarStudio
 */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { logout, setUser } from '../../auth/slices/authSlice';
import type { RootState } from '../../../app/store';
import { CACHE_KEYS, saveJson } from '../../../services/cache/storage';
import { MOCK_NOTIFICATIONS } from '../data/mockNotificationData';
import type { AppNotification, UpdateProfilePayload, UserProfile } from '../types/profile.types';
import { buildProfileFromAuth } from '../utils/buildProfile';

/** Profile feature slice shape stored under `state.profile`. */
export interface ProfileState {
  profile: UserProfile | null;
  notifications: AppNotification[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  // TODO(api): start empty; hydrate via fetchNotifications from GET /users/me/notifications
  notifications: MOCK_NOTIFICATIONS,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /users/me
      await new Promise((resolve) => setTimeout(resolve, 400));
      const { auth } = getState() as RootState;
      if (!auth.user) return rejectWithValue('Not authenticated');
      return buildProfileFromAuth(auth.user);
    } catch {
      return rejectWithValue('Failed to load profile');
    }
  },
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (payload: UpdateProfilePayload, { getState, rejectWithValue, dispatch }) => {
    try {
      // TODO(api): replace with PUT /users/me
      await new Promise((resolve) => setTimeout(resolve, 600));
      const { profile } = (getState() as RootState).profile;
      if (!profile) return rejectWithValue('Profile not loaded');

      const updated: UserProfile = {
        ...profile,
        ...payload,
      };

      dispatch(
        setUser({
          name: updated.name,
          email: updated.email,
          region: updated.region,
        }),
      );

      return updated;
    } catch {
      return rejectWithValue('Failed to update profile');
    }
  },
);

export const fetchNotifications = createAsyncThunk(
  'profile/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /users/me/notifications
      await new Promise((resolve) => setTimeout(resolve, 400));
      return MOCK_NOTIFICATIONS;
    } catch {
      return rejectWithValue('Failed to load notifications');
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  'profile/markNotificationRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /users/me/notifications/{id}/read
      await new Promise((resolve) => setTimeout(resolve, 200));
      return notificationId;
    } catch {
      return rejectWithValue('Failed to mark notification as read');
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  'profile/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /users/me/notifications/read-all
      await new Promise((resolve) => setTimeout(resolve, 300));
      return true;
    } catch {
      return rejectWithValue('Failed to mark all as read');
    }
  },
);

export const logoutUser = createAsyncThunk('profile/logoutUser', async (_, { dispatch }) => {
  // TODO(api): optional POST /auth/logout before clearing local session
  dispatch(logout());
});

export const registerFcmToken = createAsyncThunk(
  'profile/registerFcmToken',
  async (fcmToken: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /users/me { fcmToken }
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { profile } = (getState() as RootState).profile;
      const { user } = (getState() as RootState).auth;
      const base = profile ?? (user ? buildProfileFromAuth(user) : null);
      if (!base) return rejectWithValue('Profile not loaded');
      return { ...base, fcmToken };
    } catch {
      return rejectWithValue('Failed to register push token');
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileAvatar: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.avatarUrl = action.payload;
      }
    },
    setProfileFromCache: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        void saveJson(CACHE_KEYS.USER_PROFILE, action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to load profile';
      })
      .addCase(updateProfile.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isSaving = false;
        state.profile = action.payload;
        void saveJson(CACHE_KEYS.USER_PROFILE, action.payload);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isSaving = false;
        state.error = (action.payload as string) ?? 'Failed to update profile';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification,
        );
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          read: true,
        }));
      })
      .addCase(registerFcmToken.fulfilled, (state, action) => {
        state.profile = action.payload;
        void saveJson(CACHE_KEYS.USER_PROFILE, action.payload);
      })
      .addCase(logout, (state) => {
        state.profile = null;
        state.notifications = MOCK_NOTIFICATIONS;
        state.isLoading = false;
        state.isSaving = false;
        state.error = null;
      });
  },
});

export const { setProfileAvatar, setProfileFromCache } = profileSlice.actions;

export default profileSlice.reducer;
