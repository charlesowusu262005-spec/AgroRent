/**
 * @file        filterEquipment.ts
 * @feature     Equipment
 * @description Client-side filter, text search, and sort for equipment listings.
 * @data        Equipment, EquipmentFilters, GeoPoint
 * @consumes    getDistanceKm
 * @author      MiStarStudio
 */

import type { Equipment, EquipmentFilters, GeoPoint } from '../types/equipment.types';
import { getDistanceKm } from './distance';

/**
 * Applies radius, price, category, and text filters then sorts results.
 * Mirrors expected GET /equipment query behaviour until API replaces mocks.
 */
export function filterAndSortEquipment(
  items: Equipment[],
  filters: EquipmentFilters,
  query: string,
  userLocation: GeoPoint,
): Equipment[] {
  const normalizedQuery = query.trim().toLowerCase();

  let results = items.filter((item) => {
    // WHY: inactive listings must never appear in farmer-facing search
    if (!item.isActive) return false;

    const distance = getDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      item.latitude,
      item.longitude,
    );

    if (distance > filters.radiusKm) return false;
    if (item.dailyRate > filters.maxPrice) return false;
    if (
      filters.category.length > 0 &&
      !filters.category.includes(item.category)
    ) {
      return false;
    }
    if (
      normalizedQuery &&
      !item.name.toLowerCase().includes(normalizedQuery) &&
      !item.locationName.toLowerCase().includes(normalizedQuery) &&
      !item.description.toLowerCase().includes(normalizedQuery)
    ) {
      return false;
    }

    return true;
  });

  // WHY: sort runs after filter so distance is only computed for visible items
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
      case 'price_asc':
        return a.dailyRate - b.dailyRate;
      case 'price_desc':
        return b.dailyRate - a.dailyRate;
      case 'rating':
        return b.avgRating - a.avgRating;
      case 'distance':
      default:
        return distA - distB;
    }
  });

  return results;
}

/** Attaches computed distance for display without mutating source Equipment. */
export function withDistance(
  item: Equipment,
  userLocation: GeoPoint,
): Equipment & { distanceKm: number } {
  return {
    ...item,
    distanceKm: getDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      item.latitude,
      item.longitude,
    ),
  };
}
