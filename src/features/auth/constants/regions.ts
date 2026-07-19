/**
 * @file        regions.ts
 * @feature     Auth
 * @description Canonical list of Ghana's 16 administrative regions for registration — ensures consistent values before a regions API exists.
 * @data        Static constant; eventual GET /regions or bundled geo reference data
 * @consumes    —
 * @author      MiStarStudio
 */

/** All 16 regions of Ghana as of the current administrative division — used by RegionPicker. */
export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Eastern',
  'Volta',
  'Northern',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
  'Western North',
  'Savannah',
  'North East',
  'Oti',
] as const;

/** Union type derived from GHANA_REGIONS for type-safe region selection. */
export type GhanaRegion = (typeof GHANA_REGIONS)[number];
