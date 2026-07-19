/**
 * @file        mockEquipmentData.ts
 * @feature     Equipment
 * @description Static Ghana-region equipment listings and availability for offline/dev use.
 * @data        MOCK_EQUIPMENT, MOCK_AVAILABILITY
 * @author      MiStarStudio
 */

import { EquipmentCategory } from '../types/equipment.types';
import type { BookedDateRange, Equipment, EquipmentAvailability } from '../types/equipment.types';

/** Placeholder image URLs keyed by seed for consistent picsum thumbnails. */
const img = (seed: string) => `https://picsum.photos/seed/agrorent-${seed}/800/600`;

// TODO(api): replace with GET /equipment — remove static seed data
export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-001',
    ownerId: 'owner-1',
    ownerName: 'Kwame Asante',
    memberSince: '2022',
    name: 'Massey Ferguson 375',
    category: EquipmentCategory.TRACTOR,
    description:
      'Reliable 75HP tractor ideal for ploughing and hauling in the Ashanti region. Well maintained with recent service records.',
    dailyRate: 180,
    weeklyRate: 1100,
    latitude: 6.6885,
    longitude: -1.6244,
    locationName: 'Kumasi, Ashanti',
    images: [img('mf375'), img('mf375b')],
    avgRating: 4.8,
    reviewCount: 24,
    isActive: true,
  },
  {
    id: 'eq-002',
    ownerId: 'owner-2',
    ownerName: 'Ama Osei',
    memberSince: '2021',
    name: 'John Deere 5075E',
    category: EquipmentCategory.TRACTOR,
    description:
      'Versatile utility tractor with front loader attachment. Perfect for medium-scale maize and cassava farms.',
    dailyRate: 220,
    weeklyRate: 1350,
    latitude: 5.6037,
    longitude: -0.187,
    locationName: 'Accra, Greater Accra',
    images: [img('jd5075')],
    avgRating: 4.6,
    reviewCount: 18,
    isActive: true,
  },
  {
    id: 'eq-003',
    ownerId: 'owner-3',
    ownerName: 'Kofi Mensah',
    memberSince: '2023',
    name: 'Kubota DC-70 Combine',
    category: EquipmentCategory.COMBINE_HARVESTER,
    description:
      'Rice combine harvester available for seasonal harvest windows. Operator available on request.',
    dailyRate: 450,
    weeklyRate: 2800,
    latitude: 5.9254,
    longitude: -0.9887,
    locationName: 'Kasoa, Central',
    images: [img('kubota-combine')],
    avgRating: 4.9,
    reviewCount: 11,
    isActive: true,
  },
  {
    id: 'eq-004',
    ownerId: 'owner-1',
    ownerName: 'Kwame Asante',
    memberSince: '2022',
    name: 'Reversible Disc Plough',
    category: EquipmentCategory.PLOUGH,
    description:
      'Heavy-duty 3-disc plough for clay soils. Compatible with 60–90HP tractors.',
    dailyRate: 65,
    weeklyRate: 380,
    latitude: 6.701,
    longitude: -1.615,
    locationName: 'Ejisu, Ashanti',
    images: [img('disc-plough')],
    avgRating: 4.4,
    reviewCount: 9,
    isActive: true,
  },
  {
    id: 'eq-005',
    ownerId: 'owner-4',
    ownerName: 'Yaw Boateng',
    memberSince: '2020',
    name: 'Solar Drip Irrigation Kit',
    category: EquipmentCategory.IRRIGATION,
    description:
      '2-acre drip irrigation system with solar pump. Includes hoses, emitters, and timer.',
    dailyRate: 95,
    weeklyRate: 550,
    latitude: 5.1053,
    longitude: -1.2466,
    locationName: 'Cape Coast, Central',
    images: [img('drip-irrigation')],
    avgRating: 4.7,
    reviewCount: 15,
    isActive: true,
  },
  {
    id: 'eq-006',
    ownerId: 'owner-5',
    ownerName: 'Abena Darko',
    memberSince: '2022',
    name: 'Motorized Knapsack Sprayer (20L)',
    category: EquipmentCategory.SPRAYER,
    description:
      'Battery-powered sprayer for cocoa and vegetable farms. Two units available.',
    dailyRate: 25,
    weeklyRate: 140,
    latitude: 6.0944,
    longitude: -0.2591,
    locationName: 'Koforidua, Eastern',
    images: [img('knapsack-sprayer')],
    avgRating: 4.3,
    reviewCount: 7,
    isActive: true,
  },
  {
    id: 'eq-007',
    ownerId: 'owner-6',
    ownerName: 'Ibrahim Sule',
    memberSince: '2021',
    name: 'New Holland TD5.95',
    category: EquipmentCategory.TRACTOR,
    description:
      '95HP tractor with air-conditioned cab. Suitable for large-acreage row cropping in the north.',
    dailyRate: 280,
    weeklyRate: 1700,
    latitude: 9.4034,
    longitude: -0.8424,
    locationName: 'Tamale, Northern',
    images: [img('jd5075')],
    avgRating: 4.5,
    reviewCount: 13,
    isActive: true,
  },
  {
    id: 'eq-008',
    ownerId: 'owner-7',
    ownerName: 'Efua Adjei',
    memberSince: '2023',
    name: 'Precision Maize Seeder',
    category: EquipmentCategory.SEEDER,
    description:
      '4-row maize planter with fertilizer attachment. Calibrated for local seed varieties.',
    dailyRate: 75,
    weeklyRate: 420,
    latitude: 7.9465,
    longitude: -1.0232,
    locationName: 'Sunyani, Bono',
    images: [img('maize-seeder')],
    avgRating: 4.2,
    reviewCount: 5,
    isActive: true,
  },
  {
    id: 'eq-009',
    ownerId: 'owner-2',
    ownerName: 'Ama Osei',
    memberSince: '2021',
    name: 'Boom Sprayer 600L',
    category: EquipmentCategory.SPRAYER,
    description:
      'Tractor-mounted boom sprayer for herbicide and pesticide application across 10+ acres per day.',
    dailyRate: 120,
    weeklyRate: 700,
    latitude: 5.65,
    longitude: -0.22,
    locationName: 'Tema, Greater Accra',
    images: [img('knapsack-sprayer')],
    avgRating: 4.6,
    reviewCount: 10,
    isActive: true,
  },
  {
    id: 'eq-010',
    ownerId: 'owner-8',
    ownerName: 'Daniel Tetteh',
    memberSince: '2019',
    name: 'Centre Pivot Irrigation',
    category: EquipmentCategory.IRRIGATION,
    description:
      'Centre pivot system covering up to 25 acres. Ideal for commercial vegetable production.',
    dailyRate: 350,
    weeklyRate: 2100,
    latitude: 5.8919,
    longitude: -0.0871,
    locationName: 'Nsawam, Eastern',
    images: [img('drip-irrigation')],
    avgRating: 4.8,
    reviewCount: 21,
    isActive: true,
  },
  {
    id: 'eq-011',
    ownerId: 'owner-9',
    ownerName: 'Rashid Mohammed',
    memberSince: '2022',
    name: 'Mini Tiller 15HP',
    category: EquipmentCategory.OTHER,
    description:
      'Compact power tiller for smallholder vegetable plots and rice nurseries.',
    dailyRate: 45,
    weeklyRate: 260,
    latitude: 6.6666,
    longitude: -1.6163,
    locationName: 'Obuasi, Ashanti',
    images: [img('kubota-combine')],
    avgRating: 4.1,
    reviewCount: 6,
    isActive: true,
  },
  {
    id: 'eq-012',
    ownerId: 'owner-3',
    ownerName: 'Kofi Mensah',
    memberSince: '2023',
    name: 'Claas Dominator 68',
    category: EquipmentCategory.COMBINE_HARVESTER,
    description:
      'High-capacity combine for maize and soybean harvest. Delivery to site available within Central region.',
    dailyRate: 520,
    weeklyRate: 3100,
    latitude: 5.1315,
    longitude: -1.2732,
    locationName: 'Winneba, Central',
    images: [img('claas-combine'), img('claas-combine-b')],
    avgRating: 4.7,
    reviewCount: 8,
    isActive: false,
  },
];

/** Builds relative booked ranges from today for calendar demo data. */
function rangesFor(equipmentId: string): BookedDateRange[] {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const addDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  };

  const presets: Record<string, BookedDateRange[]> = {
    'eq-001': [
      { startDate: fmt(addDays(2)), endDate: fmt(addDays(5)) },
      { startDate: fmt(addDays(12)), endDate: fmt(addDays(15)) },
    ],
    'eq-002': [{ startDate: fmt(addDays(1)), endDate: fmt(addDays(3)) }],
    'eq-003': [{ startDate: fmt(addDays(7)), endDate: fmt(addDays(14)) }],
    'eq-005': [{ startDate: fmt(addDays(4)), endDate: fmt(addDays(6)) }],
    'eq-007': [{ startDate: fmt(addDays(10)), endDate: fmt(addDays(18)) }],
  };

  return presets[equipmentId] ?? [{ startDate: fmt(addDays(3)), endDate: fmt(addDays(4)) }];
}

// TODO(api): replace with GET /equipment/availability
export const MOCK_AVAILABILITY: EquipmentAvailability[] = MOCK_EQUIPMENT.map((eq) => ({
  equipmentId: eq.id,
  bookedRanges: rangesFor(eq.id),
}));

/** Lookup helper used by thunks and edit screen until GET /equipment/{id} exists. */
export function getMockEquipmentById(id: string): Equipment | undefined {
  return MOCK_EQUIPMENT.find((item) => item.id === id);
}

/** Returns booked date ranges for one listing; empty array when unknown id. */
export function getMockAvailability(equipmentId: string): BookedDateRange[] {
  return MOCK_AVAILABILITY.find((a) => a.equipmentId === equipmentId)?.bookedRanges ?? [];
}
