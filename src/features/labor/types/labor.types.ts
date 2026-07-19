/**
 * @file        labor.types.ts
 * @feature     Labor
 * @description Domain types for farm worker profiles, hire jobs, and search filters.
 * @data        JobStatus, WorkerProfile, LaborJob, WorkerSortBy, WorkerSearchFilters, CreateJobPayload
 * @author      MiStarStudio
 */

/** Lifecycle states for a labor hire job from request through completion. */
export enum JobStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

/** Searchable farm worker profile with skills, rates, and geo coordinates. */
export interface WorkerProfile {
  userId: string;
  name: string;
  avatarUrl?: string;
  skills: string[];
  certifications: string[];
  hourlyRate: number;
  available: boolean;
  avgRating: number;
  reviewCount: number;
  region: string;
  latitude: number;
  longitude: number;
  bio?: string;
}

/** A hire request linking a farmer, worker, service type, and agreed pay. */
export interface LaborJob {
  id: string;
  farmerId: string;
  farmerName: string;
  workerId: string;
  workerName: string;
  serviceType: string;
  jobDate: string;
  locationName: string;
  agreedAmount: number;
  status: JobStatus;
  notes?: string;
  createdAt: string;
}

/** Sort options for the worker search results list. */
export type WorkerSortBy = 'rating' | 'distance' | 'rate_asc' | 'rate_desc';

/** Filter state persisted in Redux for worker discovery. */
export interface WorkerSearchFilters {
  skill: string | null;
  region: string | null;
  availableOnly: boolean;
  sortBy: WorkerSortBy;
}

/** Payload for creating a new hire request from the labor request form. */
export interface CreateJobPayload {
  workerId: string;
  workerName: string;
  serviceType: string;
  jobDate: string;
  locationName: string;
  agreedAmount: number;
  notes?: string;
}
