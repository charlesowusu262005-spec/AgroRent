/**
 * @file        mockDashboardData.ts
 * @feature     Dashboard
 * @description Static owner revenue summary, listing view/booking stats, and farmer recommendation IDs.
 * @data        MOCK_OWNER_SUMMARY, MOCK_LISTING_STATS, getOwnerListings, RECOMMENDED_EQUIPMENT_IDS
 * @author      MiStarStudio
 */

import { MOCK_EQUIPMENT } from '../../equipment/data/mockEquipmentData';

// TODO(api): replace with GET /dashboard/owner-summary — remove static revenue and listing stats
export const MOCK_OWNER_SUMMARY = {
  monthlyRevenue: 4820,
  percentChange: 12.5,
  sparklineData: [320, 410, 380, 520, 490, 610, 580, 720, 650, 780, 820, 920],
};

export interface ListingQuickStat {
  equipmentId: string;
  views: number;
  bookingsCount: number;
}

export const MOCK_LISTING_STATS: ListingQuickStat[] = [
  { equipmentId: 'eq-001', views: 124, bookingsCount: 8 },
  { equipmentId: 'eq-002', views: 98, bookingsCount: 5 },
  { equipmentId: 'eq-005', views: 76, bookingsCount: 4 },
  { equipmentId: 'eq-008', views: 52, bookingsCount: 2 },
];

export const DEMO_OWNER_ID = 'owner-1';

/** Resolves owner equipment with view/booking counts from mock stats or zero fallbacks. */
export function getOwnerListings(ownerId: string = DEMO_OWNER_ID) {
  return MOCK_EQUIPMENT.filter((item) => item.ownerId === ownerId).map((equipment) => {
    const stats = MOCK_LISTING_STATS.find((s) => s.equipmentId === equipment.id);
    return {
      equipment,
      views: stats?.views ?? 0,
      bookingsCount: stats?.bookingsCount ?? 0,
    };
  });
}

// TODO(api): replace with GET /dashboard/farmer-summary — personalized recommendation IDs
export const RECOMMENDED_EQUIPMENT_IDS = ['eq-001', 'eq-002', 'eq-007', 'eq-005'];
