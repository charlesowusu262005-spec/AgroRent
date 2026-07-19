/**
 * @file        filterWorkers.ts
 * @feature     Labor
 * @description Client-side worker search filtering and distance-aware sorting.
 * @data        WorkerProfile, WorkerSearchFilters, GeoPoint
 * @consumes    equipment/utils/distance
 * @author      MiStarStudio
 */

import type { WorkerProfile, WorkerSearchFilters } from '../types/labor.types';
import { getDistanceKm } from '../../equipment/utils/distance';
import type { GeoPoint } from '../../equipment/types/equipment.types';

/** Applies text, skill, region, and availability filters then sorts by user preference. */
export function filterAndSortWorkers(
  workers: WorkerProfile[],
  query: string,
  filters: WorkerSearchFilters,
  userLocation: GeoPoint,
): WorkerProfile[] {
  const normalizedQuery = query.trim().toLowerCase();

  let results = workers.filter((worker) => {
    if (filters.availableOnly && !worker.available) return false;
    if (filters.skill && !worker.skills.includes(filters.skill)) return false;
    if (filters.region && worker.region !== filters.region) return false;
    if (
      normalizedQuery &&
      !worker.name.toLowerCase().includes(normalizedQuery) &&
      !worker.skills.some((s) => s.toLowerCase().includes(normalizedQuery)) &&
      !worker.region.toLowerCase().includes(normalizedQuery)
    ) {
      return false;
    }
    return true;
  });

  results = [...results].sort((a, b) => {
    const distA = getDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      a.latitude,
      a.longitude,
    );
    const distB = getDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      b.latitude,
      b.longitude,
    );

    switch (filters.sortBy) {
      case 'rate_asc':
        return a.hourlyRate - b.hourlyRate;
      case 'rate_desc':
        return b.hourlyRate - a.hourlyRate;
      case 'rating':
        return b.avgRating - a.avgRating;
      case 'distance':
      default:
        return distA - distB;
    }
  });

  return results;
}

/** Haversine distance from the searcher's location to a worker's coordinates. */
export function getWorkerDistance(worker: WorkerProfile, userLocation: GeoPoint): number {
  return getDistanceKm(
    userLocation.latitude,
    userLocation.longitude,
    worker.latitude,
    worker.longitude,
  );
}
