/**
 * @file        mockLaborData.ts
 * @feature     Labor
 * @description Static Ghana-region worker profiles and hire jobs for offline/dev use.
 * @data        MOCK_WORKERS, MOCK_JOBS, getWorkerById, generateJobId
 * @author      MiStarStudio
 */

import { addDays, format } from 'date-fns';

import { JobStatus } from '../types/labor.types';
import type { LaborJob, WorkerProfile } from '../types/labor.types';

/** Placeholder avatar URLs keyed by seed for consistent picsum thumbnails. */
const avatar = (seed: string) => `https://picsum.photos/seed/worker-${seed}/200/200`;

// TODO(api): replace with GET /labor/workers — remove static seed data
export const MOCK_WORKERS: WorkerProfile[] = [
  {
    userId: 'worker-1',
    name: 'Kwesi Adom',
    avatarUrl: avatar('kwesi'),
    skills: ['Land Clearing', 'Planting', 'Harvesting'],
    certifications: ['AgroSafety Certificate', 'Tractor Operator License'],
    hourlyRate: 25,
    available: true,
    avgRating: 4.8,
    reviewCount: 32,
    region: 'Ashanti',
    latitude: 6.6885,
    longitude: -1.6244,
    bio: '8 years experience on maize and cassava farms across Kumasi district.',
  },
  {
    userId: 'worker-2',
    name: 'Ama Serwaa',
    avatarUrl: avatar('ama'),
    skills: ['Spraying', 'Planting', 'Post-Harvest Handling'],
    certifications: ['Pesticide Application Certificate'],
    hourlyRate: 22,
    available: true,
    avgRating: 4.9,
    reviewCount: 28,
    region: 'Eastern',
    latitude: 6.0944,
    longitude: -0.2591,
  },
  {
    userId: 'worker-3',
    name: 'Ibrahim Tanko',
    avatarUrl: avatar('ibrahim'),
    skills: ['Irrigation Setup', 'Land Clearing', 'Tractor Operation'],
    certifications: ['Irrigation Technician Level 2'],
    hourlyRate: 35,
    available: false,
    avgRating: 4.6,
    reviewCount: 19,
    region: 'Northern',
    latitude: 9.4034,
    longitude: -0.8424,
  },
  {
    userId: 'worker-4',
    name: 'Efua Mensah',
    avatarUrl: avatar('efua'),
    skills: ['Harvesting', 'Planting', 'Livestock Care'],
    certifications: [],
    hourlyRate: 20,
    available: true,
    avgRating: 4.4,
    reviewCount: 14,
    region: 'Central',
    latitude: 5.1053,
    longitude: -1.2466,
  },
  {
    userId: 'worker-5',
    name: 'Yaw Ofori',
    avatarUrl: avatar('yaw'),
    skills: ['Spraying', 'Harvesting', 'Land Clearing'],
    certifications: ['Farm Machinery Basics'],
    hourlyRate: 28,
    available: true,
    avgRating: 4.7,
    reviewCount: 21,
    region: 'Greater Accra',
    latitude: 5.6037,
    longitude: -0.187,
  },
  {
    userId: 'worker-6',
    name: 'Abena Kumi',
    avatarUrl: avatar('abena'),
    skills: ['Planting', 'Irrigation Setup', 'Post-Harvest Handling'],
    certifications: ['Organic Farming Workshop'],
    hourlyRate: 24,
    available: true,
    avgRating: 4.5,
    reviewCount: 11,
    region: 'Bono',
    latitude: 7.9465,
    longitude: -1.0232,
  },
  {
    userId: 'worker-7',
    name: 'Kofi Boateng',
    avatarUrl: avatar('kofi'),
    skills: ['Tractor Operation', 'Land Clearing', 'Harvesting'],
    certifications: ['Heavy Equipment Operator'],
    hourlyRate: 40,
    available: true,
    avgRating: 4.8,
    reviewCount: 37,
    region: 'Ashanti',
    latitude: 6.701,
    longitude: -1.615,
  },
  {
    userId: 'worker-8',
    name: 'Rashid Mohammed',
    avatarUrl: avatar('rashid'),
    skills: ['Spraying', 'Planting', 'Livestock Care'],
    certifications: ['Animal Husbandry Certificate'],
    hourlyRate: 23,
    available: true,
    avgRating: 4.3,
    reviewCount: 9,
    region: 'Upper East',
    latitude: 10.785,
    longitude: -0.851,
  },
  {
    userId: 'worker-9',
    name: 'Grace Akoto',
    avatarUrl: avatar('grace'),
    skills: ['Harvesting', 'Post-Harvest Handling', 'Planting'],
    certifications: ['Food Safety Handler'],
    hourlyRate: 21,
    available: false,
    avgRating: 4.6,
    reviewCount: 16,
    region: 'Volta',
    latitude: 6.5833,
    longitude: 0.4667,
  },
  {
    userId: 'worker-10',
    name: 'Daniel Tetteh',
    avatarUrl: avatar('daniel'),
    skills: ['Irrigation Setup', 'Spraying', 'Land Clearing'],
    certifications: ['Drip Irrigation Installer'],
    hourlyRate: 30,
    available: true,
    avgRating: 4.7,
    reviewCount: 22,
    region: 'Eastern',
    latitude: 5.8919,
    longitude: -0.0871,
  },
];

const today = new Date();
const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

// TODO(api): replace with GET /labor/jobs — remove static seed data
export const MOCK_JOBS: LaborJob[] = [
  {
    id: 'job-001',
    farmerId: 'farmer-1',
    farmerName: 'Demo User',
    workerId: 'worker-1',
    workerName: 'Kwesi Adom',
    serviceType: 'Land Clearing',
    jobDate: fmt(addDays(today, 3)),
    locationName: 'Ejisu, Ashanti',
    agreedAmount: 200,
    status: JobStatus.PENDING,
    createdAt: fmt(addDays(today, -1)),
  },
  {
    id: 'job-002',
    farmerId: 'farmer-2',
    farmerName: 'Akosua Boateng',
    workerId: 'worker-5',
    workerName: 'Yaw Ofori',
    serviceType: 'Spraying',
    jobDate: fmt(addDays(today, 5)),
    locationName: 'Tema, Greater Accra',
    agreedAmount: 176,
    status: JobStatus.PENDING,
    createdAt: fmt(today),
  },
  {
    id: 'job-003',
    farmerId: 'farmer-1',
    farmerName: 'Demo User',
    workerId: 'worker-2',
    workerName: 'Ama Serwaa',
    serviceType: 'Harvesting',
    jobDate: fmt(addDays(today, -2)),
    locationName: 'Koforidua, Eastern',
    agreedAmount: 264,
    status: JobStatus.ACTIVE,
    createdAt: fmt(addDays(today, -7)),
  },
  {
    id: 'job-004',
    farmerId: 'farmer-1',
    farmerName: 'Demo User',
    workerId: 'worker-7',
    workerName: 'Kofi Boateng',
    serviceType: 'Tractor Operation',
    jobDate: fmt(addDays(today, -14)),
    locationName: 'Kumasi, Ashanti',
    agreedAmount: 320,
    status: JobStatus.COMPLETED,
    createdAt: fmt(addDays(today, -20)),
  },
  {
    id: 'job-005',
    farmerId: 'farmer-3',
    farmerName: 'John Doe',
    workerId: 'worker-4',
    workerName: 'Efua Mensah',
    serviceType: 'Planting',
    jobDate: fmt(addDays(today, -5)),
    locationName: 'Cape Coast, Central',
    agreedAmount: 160,
    status: JobStatus.DECLINED,
    createdAt: fmt(addDays(today, -10)),
  },
];

/** Looks up a worker profile by user id from the mock catalog. */
export function getWorkerById(id: string): WorkerProfile | undefined {
  return MOCK_WORKERS.find((w) => w.userId === id);
}

/** Generates a client-side job id until the API assigns persistent ids. */
export function generateJobId(): string {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
