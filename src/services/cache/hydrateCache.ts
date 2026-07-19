/**
 * @file        hydrateCache.ts
 * @feature     Cache
 * @description Cold-start loader that seeds Redux from persisted AsyncStorage snapshots.
 * @data        Equipment search + meta, booking history, user profile cache keys
 * @consumes    equipmentSlice, bookingSlice, profileSlice, storage
 * @author      MiStarStudio
 */

import type { AppDispatch } from '../../app/store';
import { setBookingHistoryFromCache } from '../../features/booking/slices/bookingSlice';
import { hydrateEquipmentFromCache } from '../../features/equipment/slices/equipmentSlice';
import { setProfileFromCache } from '../../features/profile/slices/profileSlice';
import { CACHE_KEYS, loadJson } from './storage';
import type { Equipment } from '../../features/equipment/types/equipment.types';
import type { Booking } from '../../features/booking/types/booking.types';
import type { UserProfile } from '../../features/profile/types/profile.types';

/** Parallel-reads all cache keys and dispatches hydrate actions when data is present. */
export async function hydrateOfflineCache(dispatch: AppDispatch): Promise<void> {
  const [equipment, equipmentMeta, bookings, profile] = await Promise.all([
    loadJson<Equipment[]>(CACHE_KEYS.EQUIPMENT_SEARCH),
    loadJson<{ lastFetchedAt: number }>(CACHE_KEYS.EQUIPMENT_META),
    loadJson<Booking[]>(CACHE_KEYS.BOOKING_HISTORY),
    loadJson<UserProfile>(CACHE_KEYS.USER_PROFILE),
  ]);

  if (equipment?.length) {
    dispatch(
      hydrateEquipmentFromCache({
        searchResults: equipment,
        lastFetchedAt: equipmentMeta?.lastFetchedAt ?? null,
      }),
    );
  }

  if (bookings?.length) {
    dispatch(setBookingHistoryFromCache(bookings));
  }

  if (profile) {
    dispatch(setProfileFromCache(profile));
  }
}
