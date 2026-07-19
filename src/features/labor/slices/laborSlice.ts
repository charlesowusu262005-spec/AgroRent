/**
 * @file        laborSlice.ts
 * @feature     Labor
 * @description Redux state for worker search, hire jobs, and worker-side job management.
 * @data        LaborState, fetchWorkers, fetchWorkerById, createJob, acceptJob, declineJob, completeJob, startJob
 * @consumes    mockLaborData, filterWorkers
 * @author      MiStarStudio
 */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { ACCRA_CENTER } from '../../equipment/utils/distance';
import type { GeoPoint } from '../../equipment/types/equipment.types';
import {
  MOCK_JOBS,
  MOCK_WORKERS,
  generateJobId,
  getWorkerById,
} from '../data/mockLaborData';
import {
  JobStatus,
  type CreateJobPayload,
  type LaborJob,
  type WorkerProfile,
  type WorkerSearchFilters,
} from '../types/labor.types';
import { filterAndSortWorkers } from '../utils/filterWorkers';

/** Labor feature slice shape stored under `state.labor`. */
export interface LaborState {
  workerSearchResults: WorkerProfile[];
  myJobs: LaborJob[];
  incomingJobs: LaborJob[];
  workerJobs: LaborJob[];
  workerProfile: WorkerProfile | null;
  selectedWorker: WorkerProfile | null;
  filters: WorkerSearchFilters;
  searchQuery: string;
  userLocation: GeoPoint;
  isLoading: boolean;
  error: string | null;
}

/** Demo worker id — incoming jobs and worker tabs filter against this user in dev. */
const DEMO_WORKER_ID = 'worker-1';

// ─── Initial state ───────────────────────────────────────────────────────────

const initialState: LaborState = {
  workerSearchResults: MOCK_WORKERS,
  myJobs: MOCK_JOBS.filter((j) => j.farmerId === 'farmer-1'),
  incomingJobs: MOCK_JOBS.filter(
    (j) => j.status === JobStatus.PENDING && j.workerId === DEMO_WORKER_ID,
  ),
  workerJobs: MOCK_JOBS.filter((j) => j.workerId === DEMO_WORKER_ID),
  workerProfile: MOCK_WORKERS.find((w) => w.userId === DEMO_WORKER_ID) ?? MOCK_WORKERS[0],
  selectedWorker: null,
  filters: {
    skill: null,
    region: null,
    availableOnly: true,
    sortBy: 'rating',
  },
  searchQuery: '',
  userLocation: ACCRA_CENTER,
  isLoading: false,
  error: null,
};

// ─── Async thunks ────────────────────────────────────────────────────────────

/** Searches workers by query and filters — client-side until geo API is wired. */
export const fetchWorkers = createAsyncThunk(
  'labor/fetchWorkers',
  async (
    {
      query,
      filters,
      lat,
      lng,
    }: { query: string; filters: WorkerSearchFilters; lat: number; lng: number },
    { rejectWithValue },
  ) => {
    try {
      // TODO(api): replace with GET /labor/workers?skill=&region=&available=
      await new Promise((resolve) => setTimeout(resolve, 500));
      return filterAndSortWorkers(MOCK_WORKERS, query, filters, {
        latitude: lat,
        longitude: lng,
      });
    } catch {
      return rejectWithValue('Failed to load workers');
    }
  },
);

/** Loads a single worker profile for the detail screen. */
export const fetchWorkerById = createAsyncThunk(
  'labor/fetchWorkerById',
  async (workerId: string, { rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /labor/workers/{id}
      await new Promise((resolve) => setTimeout(resolve, 400));
      const worker = getWorkerById(workerId);
      if (!worker) return rejectWithValue('Worker not found');
      return worker;
    } catch {
      return rejectWithValue('Failed to load worker');
    }
  },
);

/** Farmer submits a hire request — job starts in PENDING awaiting worker response. */
export const createJob = createAsyncThunk(
  'labor/createJob',
  async (
    payload: CreateJobPayload & { farmerId: string; farmerName: string },
    { rejectWithValue },
  ) => {
    try {
      // TODO(api): replace with POST /labor/jobs
      await new Promise((resolve) => setTimeout(resolve, 600));

      const job: LaborJob = {
        id: generateJobId(),
        farmerId: payload.farmerId,
        farmerName: payload.farmerName,
        workerId: payload.workerId,
        workerName: payload.workerName,
        serviceType: payload.serviceType,
        jobDate: payload.jobDate,
        locationName: payload.locationName,
        agreedAmount: payload.agreedAmount,
        status: JobStatus.PENDING,
        notes: payload.notes,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      return job;
    } catch {
      return rejectWithValue('Failed to create job request');
    }
  },
);

/** Worker accepts a pending hire request. */
export const acceptJob = createAsyncThunk(
  'labor/acceptJob',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /labor/jobs/{id}/accept
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { labor: LaborState };
      const job =
        state.labor.incomingJobs.find((j) => j.id === jobId) ??
        state.labor.workerJobs.find((j) => j.id === jobId) ??
        state.labor.myJobs.find((j) => j.id === jobId);
      if (!job) return rejectWithValue('Job not found');
      return { ...job, status: JobStatus.ACCEPTED };
    } catch {
      return rejectWithValue('Failed to accept job');
    }
  },
);

/** Worker declines a pending hire request. */
export const declineJob = createAsyncThunk(
  'labor/declineJob',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /labor/jobs/{id}/decline
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { labor: LaborState };
      const job =
        state.labor.incomingJobs.find((j) => j.id === jobId) ??
        state.labor.workerJobs.find((j) => j.id === jobId);
      if (!job) return rejectWithValue('Job not found');
      return { ...job, status: JobStatus.DECLINED };
    } catch {
      return rejectWithValue('Failed to decline job');
    }
  },
);

/** Marks an active job as completed after work is finished. */
export const completeJob = createAsyncThunk(
  'labor/completeJob',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /labor/jobs/{id}/complete
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { labor: LaborState };
      const job =
        state.labor.myJobs.find((j) => j.id === jobId) ??
        state.labor.workerJobs.find((j) => j.id === jobId) ??
        state.labor.incomingJobs.find((j) => j.id === jobId);
      if (!job) return rejectWithValue('Job not found');
      return { ...job, status: JobStatus.COMPLETED };
    } catch {
      return rejectWithValue('Failed to complete job');
    }
  },
);

/** Farmer marks job as active when work begins on the agreed date. */
export const startJob = createAsyncThunk(
  'labor/startJob',
  async (jobId: string, { getState, rejectWithValue }) => {
    try {
      // TODO(api): replace with PUT /labor/jobs/{id}/start
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as { labor: LaborState };
      const job =
        state.labor.myJobs.find((j) => j.id === jobId) ??
        state.labor.workerJobs.find((j) => j.id === jobId) ??
        state.labor.incomingJobs.find((j) => j.id === jobId);
      if (!job) return rejectWithValue('Job not found');
      return { ...job, status: JobStatus.ACTIVE };
    } catch {
      return rejectWithValue('Failed to start job');
    }
  },
);

/** Keeps farmer, worker, and incoming job lists in sync after status transitions. */
const updateJobInLists = (state: LaborState, job: LaborJob) => {
  state.myJobs = state.myJobs.map((j) => (j.id === job.id ? job : j));
  state.workerJobs = state.workerJobs.some((j) => j.id === job.id)
    ? state.workerJobs.map((j) => (j.id === job.id ? job : j))
    : job.workerId === DEMO_WORKER_ID
      ? [job, ...state.workerJobs]
      : state.workerJobs;

  if (job.status === JobStatus.PENDING && job.workerId === DEMO_WORKER_ID) {
    state.incomingJobs = state.incomingJobs.some((j) => j.id === job.id)
      ? state.incomingJobs.map((j) => (j.id === job.id ? job : j))
      : [job, ...state.incomingJobs];
  } else {
    state.incomingJobs = state.incomingJobs.filter((j) => j.id !== job.id);
  }
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const laborSlice = createSlice({
  name: 'labor',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<WorkerSearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setWorkerAvailability: (state, action: PayloadAction<boolean>) => {
      if (state.workerProfile) {
        state.workerProfile.available = action.payload;
      }
    },
    setUserLocation: (state, action: PayloadAction<GeoPoint>) => {
      state.userLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workerSearchResults = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to load workers';
      })
      .addCase(fetchWorkerById.pending, (state) => {
        state.isLoading = true;
        state.selectedWorker = null;
      })
      .addCase(fetchWorkerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedWorker = action.payload;
      })
      .addCase(fetchWorkerById.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.myJobs = [action.payload, ...state.myJobs];
        if (action.payload.workerId === DEMO_WORKER_ID) {
          state.workerJobs = [action.payload, ...state.workerJobs];
          state.incomingJobs = [action.payload, ...state.incomingJobs];
        }
      })
      .addCase(acceptJob.fulfilled, (state, action) => {
        updateJobInLists(state, action.payload);
      })
      .addCase(declineJob.fulfilled, (state, action) => {
        updateJobInLists(state, action.payload);
      })
      .addCase(completeJob.fulfilled, (state, action) => {
        updateJobInLists(state, action.payload);
      })
      .addCase(startJob.fulfilled, (state, action) => {
        updateJobInLists(state, action.payload);
      });
  },
});

export const { setSearchQuery, setFilters, setWorkerAvailability, setUserLocation } =
  laborSlice.actions;

export default laborSlice.reducer;
