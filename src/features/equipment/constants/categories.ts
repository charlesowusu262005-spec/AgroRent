/**
 * @file        categories.ts
 * @feature     Equipment
 * @description Display labels and default filter bounds for equipment categories.
 * @data        CATEGORY_LABELS, ALL_CATEGORIES, DEFAULT_MAX_PRICE, DEFAULT_RADIUS_KM
 * @author      MiStarStudio
 */

import { EquipmentCategory } from '../types/equipment.types';

/** Human-readable labels for category chips and badges. */
export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  [EquipmentCategory.TRACTOR]: 'Tractor',
  [EquipmentCategory.COMBINE_HARVESTER]: 'Combine Harvester',
  [EquipmentCategory.IRRIGATION]: 'Irrigation',
  [EquipmentCategory.SPRAYER]: 'Sprayer',
  [EquipmentCategory.PLOUGH]: 'Plough',
  [EquipmentCategory.SEEDER]: 'Seeder',
  [EquipmentCategory.OTHER]: 'Other',
};

/** All enum values for horizontal category pickers. */
export const ALL_CATEGORIES = Object.values(EquipmentCategory);

/** Default max daily rate (GHS) before user adjusts filter slider. */
export const DEFAULT_MAX_PRICE = 500;

/** Default search radius (km) centred on user or Accra fallback. */
export const DEFAULT_RADIUS_KM = 50;
