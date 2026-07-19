/**
 * @file        BookingStackNavigator.tsx
 * @feature     Navigation
 * @description Shared booking + payment stack for farmers (history) and owners (management).
 * @navigation  FarmerTab | OwnerTab > Bookings > BookingStack
 * @data        auth.role, BookingStackParamList (bookingId, paymentId, equipmentId)
 * @consumes    booking and payment feature screens, header options
 * @author      MiStarStudio
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppSelector } from '../app/hooks';
import {
  BookingConfirmScreen,
  BookingDetailScreen,
  BookingHistoryScreen,
  BookingManagementScreen,
  BookingRequestScreen,
} from '../features/booking/screens';
import {
  PaymentScreen,
  PaymentStatusScreen,
  ReceiptScreen,
  TransactionHistoryScreen,
} from '../features/payment/screens';
import { backOnlyHeaderOptions, hiddenHeaderOptions } from './options';
import type { BookingStackParamList } from './types';

const Stack = createNativeStackNavigator<BookingStackParamList>();

/**
 * Booking lifecycle stack shared across farmer and owner tabs.
 * WHY role-based initial route: farmers care about their rental history; owners need
 * incoming request management first — same stack, different landing screen per role.
 */
export function BookingStackNavigator() {
  const role = useAppSelector((state) => state.auth.role);
  const initialRouteName = role === 'OWNER' ? 'Management' : 'History';

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={hiddenHeaderOptions}>
      {/* ── Tab roots (role-dependent initial) ───────────────────────────── */}
      <Stack.Screen name="History" component={BookingHistoryScreen} />
      <Stack.Screen name="Management" component={BookingManagementScreen} />

      {/* ── Booking flow ─────────────────────────────────────────────────── */}
      <Stack.Screen
        name="Request"
        component={BookingRequestScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="Confirm"
        component={BookingConfirmScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="Detail"
        component={BookingDetailScreen}
        options={backOnlyHeaderOptions}
      />

      {/* ── Payments ─────────────────────────────────────────────────────── */}
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="PaymentStatus"
        component={PaymentStatusScreen}
        // WHY gestureEnabled false: prevents swipe-back after payment redirect loops.
        options={{ ...backOnlyHeaderOptions, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={backOnlyHeaderOptions}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={backOnlyHeaderOptions}
      />
    </Stack.Navigator>
  );
}
