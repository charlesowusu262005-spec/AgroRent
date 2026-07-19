/**
 * @file        mockAuth.ts
 * @feature     Auth
 * @description Temporary auth helpers that simulate API responses during development — remove once real endpoints are wired.
 * @data        In-memory mock tokens and user objects; replace with POST /auth/login and POST /auth/verify-otp responses
 * @consumes    auth.types
 * @author      MiStarStudio
 */

import type { User, UserRole } from '../types/auth.types';

/** Stable mock ids aligned with seed data in equipment, booking, and labor modules. */
export const DEMO_USER_IDS: Record<UserRole, string> = {
  FARMER: 'farmer-1',
  OWNER: 'owner-1',
  WORKER: 'worker-1',
};

/**
 * Builds a fake User for login/OTP success paths until the backend returns real profiles.
 * Uses role-based demo ids so owner/farmer/worker flows match mock listings and bookings.
 */
export function createMockUser(
  partial: Pick<User, 'name' | 'phone' | 'role'> & Partial<User>,
): User {
  return {
    id: partial.id ?? DEMO_USER_IDS[partial.role],
    email: partial.email,
    region: partial.region,
    ...partial,
  };
}

/** Shapes the Redux setCredentials payload — mirrors expected JWT auth response. */
export function createMockAuthResponse(user: User) {
  return {
    user,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };
}

/** Human-readable role label for profile UI and settings screens. */
export function roleLabel(role: UserRole): string {
  switch (role) {
    case 'FARMER':
      return 'Farmer';
    case 'OWNER':
      return 'Equipment Owner';
    case 'WORKER':
      return 'Worker';
    default:
      return role;
  }
}
