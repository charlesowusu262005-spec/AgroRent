/**
 * @file        distance.ts
 * @feature     Equipment
 * @description Haversine distance helpers and Accra fallback for location-unavailable users.
 * @data        ACCRA_CENTER
 * @author      MiStarStudio
 */

/** Earth radius in km for Haversine formula. */
const R = 6371;

/**
 * Great-circle distance between two WGS-84 coordinates.
 *
 * @returns Distance in kilometres.
 */
export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Formats distance for card and compare UI — metres when under 1 km for precision.
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Fallback centre when GPS permission is denied or unavailable. */
export const ACCRA_CENTER = {
  latitude: 5.6037,
  longitude: -0.187,
};
