/**
 * @file        types.ts
 * @feature     Navigation
 * @description Central TypeScript param lists for every navigator and nested stack in AgroRent Ghana.
 * @navigation  RootStack > Auth | Main > role tabs > nested stacks
 * @data        Route params (ids, phones, OTP payloads, nested NavigatorScreenParams)
 * @consumes    auth.types (OTPPurpose, RegisterFormData)
 * @author      MiStarStudio
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

import type { OTPPurpose, RegisterFormData } from '../features/auth/types/auth.types';

// ── Root & auth ─────────────────────────────────────────────────────────────

/** Top-level gate: unauthenticated Auth flow or authenticated Main (role tabs). */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

/** Sign-in, registration, OTP, and password-recovery screens. */
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  OTPVerification: {
    phone: string;
    purpose?: OTPPurpose;
    registerData?: RegisterFormData;
  };
  ForgotPassword: undefined;
  NewPassword: { phone: string };
};

// ── Feature stacks ──────────────────────────────────────────────────────────

/** Farmer Search tab — equipment discovery, compare, and reviews. */
export type EquipmentStackParamList = {
  Search: undefined;
  Map: undefined;
  Detail: { equipmentId: string };
  Compare: { equipmentIds: string[] };
  AddEquipment: undefined;
  EditEquipment: { equipmentId: string };
  SubmitReview: {
    targetId: string;
    targetType: 'EQUIPMENT' | 'WORKER';
    targetName: string;
  };
};

/** Shared Bookings tab — farmer history vs owner management plus payment flow. */
export type BookingStackParamList = {
  Request: { equipmentId?: string } | undefined;
  Confirm: undefined;
  History: undefined;
  Management: undefined;
  Detail: { bookingId: string };
  Payment: { bookingId?: string } | undefined;
  PaymentStatus: { paymentId: string };
  TransactionHistory: undefined;
  Receipt: { paymentId: string };
};

/** Owner Listings tab — CRUD for owned equipment only. */
export type OwnerListingsStackParamList = {
  MyListings: undefined;
  AddEquipment: undefined;
  EditEquipment: { equipmentId: string };
};

/** Farmer LaborHub / Worker Jobs — hire workers or track assignments. */
export type LaborStackParamList = {
  Hub: undefined;
  WorkerJobs: undefined;
  WorkerDetail: { workerId: string };
  HireRequest: { workerId: string };
  JobDetail: { jobId: string; viewerRole?: 'farmer' | 'worker' };
  SubmitReview: {
    targetId: string;
    targetType: 'EQUIPMENT' | 'WORKER';
    targetName: string;
  };
};

/** Profile tab — account settings and notifications (all roles). */
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Notifications: undefined;
};

// ── Role tab param lists ────────────────────────────────────────────────────

/** Farmer bottom tabs; stack tabs use NavigatorScreenParams for nested routing & deep links. */
export type FarmerTabParamList = {
  Home: undefined;
  Search: NavigatorScreenParams<EquipmentStackParamList>;
  Bookings: NavigatorScreenParams<BookingStackParamList>;
  LaborHub: NavigatorScreenParams<LaborStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

/** Owner bottom tabs. */
export type OwnerTabParamList = {
  Dashboard: undefined;
  Listings: NavigatorScreenParams<OwnerListingsStackParamList>;
  Bookings: NavigatorScreenParams<BookingStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

/** Worker bottom tabs. */
export type WorkerTabParamList = {
  Dashboard: undefined;
  Jobs: NavigatorScreenParams<LaborStackParamList>;
  Earnings: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// ── Global typing ───────────────────────────────────────────────────────────

declare global {
  namespace ReactNavigation {
    /** WHY global augmentation: enables typed useNavigation() without importing param lists in every screen. */
    interface RootParamList extends RootStackParamList {}
  }
}
