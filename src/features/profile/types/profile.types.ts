/**
 * @file        profile.types.ts
 * @feature     Profile
 * @description Domain types for extended user profile, notifications, and profile update payloads.
 * @data        UserProfile, AppNotification, UpdateProfilePayload
 * @author      MiStarStudio
 */

import type { UserRole } from '../../auth/types/auth.types';

/** Full user profile including role-specific worker fields and push token. */
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  region?: string;
  avatarUrl?: string;
  verified: boolean;
  skills?: string[];
  certifications?: string[];
  certificationFiles?: string[];
  hourlyRate?: number;
  fcmToken?: string;
}

/** In-app notification category for icon and routing behaviour. */
export type NotificationType = 'BOOKING' | 'JOB' | 'PAYMENT' | 'REVIEW' | 'SYSTEM';

/** Deep-link target for navigating from a notification tap. */
export interface NotificationLink {
  tab: string;
  screen: string;
  params?: Record<string, unknown>;
}

/** A single in-app notification with optional tab/screen navigation link. */
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: NotificationLink;
}

/** Editable profile fields sent to PUT /users/me. */
export interface UpdateProfilePayload {
  name: string;
  email?: string;
  region?: string;
  avatarUrl?: string;
  skills?: string[];
  certifications?: string[];
  certificationFiles?: string[];
  hourlyRate?: number;
}
