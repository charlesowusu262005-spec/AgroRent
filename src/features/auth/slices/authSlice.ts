/**
 * @file        authSlice.ts
 * @feature     Auth
 * @description Redux slice holding session credentials and user profile — single source of truth for auth-gated navigation.
 * @data        Populated from POST /auth/login and POST /auth/verify-otp; cleared on logout
 * @consumes    auth.types, @reduxjs/toolkit
 * @author      MiStarStudio
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User, UserRole } from '../types/auth.types';

/** Persisted auth session shape consumed by navigators and feature guards. */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: UserRole | null; // Denormalised from user.role for quick role-based routing
}

/** Payload from login/OTP success — mirrors API auth response body. */
interface SetCredentialsPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ─── Initial state ───

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  role: null,
};

// ─── Slice ───

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Called after successful login or OTP verification — unlocks Main navigator. */
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.role = action.payload.user.role;
    },
    /** Partial profile update without re-authenticating — e.g. after PATCH /users/me. */
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (action.payload.role) {
          state.role = action.payload.role;
        }
      }
    },
    /** Clears session on explicit logout or token expiry handling. */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
