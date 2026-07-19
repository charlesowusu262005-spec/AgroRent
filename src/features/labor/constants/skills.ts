/**
 * @file        skills.ts
 * @feature     Labor
 * @description Canonical skill and service-type labels for worker profiles and hire forms.
 * @data        FARM_SKILLS, SERVICE_TYPES
 * @author      MiStarStudio
 */

/** Skills displayed on worker cards and used as search filter chips. */
export const FARM_SKILLS = [
  'Land Clearing',
  'Planting',
  'Harvesting',
  'Spraying',
  'Irrigation Setup',
  'Tractor Operation',
  'Livestock Care',
  'Post-Harvest Handling',
] as const;

/** Service types offered in the hire request form picker. */
export const SERVICE_TYPES = [
  'Land Clearing',
  'Planting',
  'Harvesting',
  'Spraying',
  'Irrigation Setup',
  'General Farm Labor',
] as const;
