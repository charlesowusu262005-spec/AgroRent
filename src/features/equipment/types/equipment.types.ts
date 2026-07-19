/**
 * @file        equipment.types.ts
 * @feature     Equipment
 * @description Domain types for rental listings, search filters, availability, and geo queries.
 * @data        Equipment, EquipmentFilters, EquipmentAvailability, GeoPoint
 * @author      MiStarStudio
 */

/** Equipment categories aligned with backend enum values. */
export enum EquipmentCategory {
  TRACTOR = 'TRACTOR',
  COMBINE_HARVESTER = 'COMBINE_HARVESTER',
  IRRIGATION = 'IRRIGATION',
  SPRAYER = 'SPRAYER',
  PLOUGH = 'PLOUGH',
  SEEDER = 'SEEDER',
  OTHER = 'OTHER',
}

/** Sort options applied client-side until server-side sort is wired. */
export type EquipmentSortBy = 'distance' | 'price_asc' | 'price_desc' | 'rating';

/** A single equipment rental listing owned by a platform member. */
export interface Equipment {
  id: string;
  ownerId: string;
  ownerName: string;
  memberSince: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  dailyRate: number;
  weeklyRate: number;
  latitude: number;
  longitude: number;
  locationName: string;
  images: string[];
  avgRating: number;
  reviewCount: number;
  /** Inactive listings are hidden from farmer search but retained for owners. */
  isActive: boolean;
}

/** User-controlled search and filter state persisted in Redux. */
export interface EquipmentFilters {
  category: EquipmentCategory[];
  maxPrice: number;
  radiusKm: number;
  sortBy: EquipmentSortBy;
}

/** Inclusive date range when equipment is already booked. */
export interface BookedDateRange {
  startDate: string;
  endDate: string;
}

/** Availability calendar payload keyed by equipment id. */
export interface EquipmentAvailability {
  equipmentId: string;
  bookedRanges: BookedDateRange[];
}

/** Latitude/longitude pair for distance calculations and map pins. */
export interface GeoPoint {
  latitude: number;
  longitude: number;
}
