/**
 * @file        staleTime.ts
 * @feature     Cache
 * @description Staleness helpers for offline-first equipment search refresh decisions.
 * @data        EQUIPMENT_STALE_MS (5 min), lastFetchedAt timestamps from equipment meta cache
 * @author      MiStarStudio
 */

/** Mirrors RTK Query default staleTime for equipment search (5 minutes). */
export const EQUIPMENT_STALE_MS = 5 * 60 * 1000;

/** Returns true when no fetch timestamp exists or age exceeds the given stale window. */
export function isStale(lastFetchedAt: number | null, staleMs = EQUIPMENT_STALE_MS): boolean {
  if (!lastFetchedAt) return true;
  return Date.now() - lastFetchedAt > staleMs;
}
