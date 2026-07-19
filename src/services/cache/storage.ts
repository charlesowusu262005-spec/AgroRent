/**
 * @file        storage.ts
 * @feature     Cache
 * @description AsyncStorage-backed JSON persistence for offline-first feature slices.
 * @data        CACHE_KEYS namespace for equipment, bookings, and profile blobs
 * @author      MiStarStudio
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/** Known cache key constants — keep in sync with hydrateCache and slice writers. */
export const CACHE_KEYS = {
  EQUIPMENT_SEARCH: 'cache:equipment:search',
  EQUIPMENT_META: 'cache:equipment:meta',
  BOOKING_HISTORY: 'cache:booking:history',
  USER_PROFILE: 'cache:profile:user',
} as const;

/** Best-effort JSON write; silently ignores storage failures. */
export async function saveJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures — cache is best-effort
  }
}

/** Reads and parses JSON; returns null on missing key or parse errors. */
export async function loadJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Removes a cache entry; silently ignores failures. */
export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}
