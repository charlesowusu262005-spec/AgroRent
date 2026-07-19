/**
 * @file        equipmentSlice.ts
 * @feature     Equipment
 * @description Redux state for search results, filters, compare selection, and detail/availability.
 * @data        EquipmentState, fetchEquipment, fetchEquipmentById, fetchEquipmentAvailability
 * @consumes    mockEquipmentData, filterEquipment, cache/storage
 * @author      MiStarStudio
 */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../../app/store';
import { CACHE_KEYS, saveJson } from '../../../services/cache/storage';
import { isStale } from '../../../services/cache/staleTime';
import {
  getMockAvailability,
  getMockEquipmentById,
  MOCK_EQUIPMENT,
} from '../data/mockEquipmentData';
import { ACCRA_CENTER } from '../utils/distance';
import { filterAndSortEquipment } from '../utils/filterEquipment';
import {
  DEFAULT_MAX_PRICE,
  DEFAULT_RADIUS_KM,
} from '../constants/categories';
import type {
  BookedDateRange,
  Equipment,
  EquipmentFilters,
  GeoPoint,
} from '../types/equipment.types';

/** Equipment feature slice shape stored under `state.equipment`. */
export interface EquipmentState {
  searchResults: Equipment[];
  filters: EquipmentFilters;
  selectedEquipment: Equipment | null;
  availability: BookedDateRange[];
  isLoading: boolean;
  searchQuery: string;
  compareIds: string[];
  userLocation: GeoPoint;
  error: string | null;
  lastFetchedAt: number | null;
}

// ─── Initial state ───────────────────────────────────────────────────────────

const initialState: EquipmentState = {
  searchResults: [],
  filters: {
    category: [],
    maxPrice: DEFAULT_MAX_PRICE,
    radiusKm: DEFAULT_RADIUS_KM,
    sortBy: 'distance',
  },
  selectedEquipment: null,
  availability: [],
  isLoading: false,
  searchQuery: '',
  compareIds: [],
  userLocation: ACCRA_CENTER,
  error: null,
  lastFetchedAt: null,
};

// ─── Async thunks ────────────────────────────────────────────────────────────

/** Loads filtered search results; respects offline cache and 5-minute stale window. */
export const fetchEquipment = createAsyncThunk(
  'equipment/fetchEquipment',
  async (
    {
      lat,
      lng,
      filters,
      query,
      force,
    }: {
      lat: number;
      lng: number;
      filters: EquipmentFilters;
      query: string;
      force?: boolean;
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState;
      // WHY: offline users keep last successful search instead of failing empty
      if (!state.network.isOnline && state.equipment.searchResults.length > 0) {
        return state.equipment.searchResults;
      }

      // TODO(api): replace with GET /equipment?lat=&lng=&radius=&category=&maxPrice=
      await new Promise((resolve) => setTimeout(resolve, 500));

      const results = filterAndSortEquipment(
        MOCK_EQUIPMENT,
        filters,
        query,
        { latitude: lat, longitude: lng },
      );

      return results;
    } catch {
      return rejectWithValue('Failed to load equipment');
    }
  },
  {
    condition: (arg, { getState }) => {
      if (arg.force) return true;
      const state = getState() as RootState;
      if (!state.network.isOnline) return false;
      if (state.equipment.searchResults.length === 0) return true;
      // WHY: skip refetch when data is fresh unless caller passes force
      return isStale(state.equipment.lastFetchedAt);
    },
  },
);

/** Loads a single listing into `selectedEquipment` for the detail screen. */
export const fetchEquipmentById = createAsyncThunk(
  'equipment/fetchEquipmentById',
  async (equipmentId: string, { rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /equipment/{id}
      await new Promise((resolve) => setTimeout(resolve, 500));

      const equipment = getMockEquipmentById(equipmentId);
      if (!equipment) {
        return rejectWithValue('Equipment not found');
      }
      return equipment;
    } catch {
      return rejectWithValue('Failed to load equipment details');
    }
  },
);

/** Loads booked date ranges for the availability calendar on detail screen. */
export const fetchEquipmentAvailability = createAsyncThunk(
  'equipment/fetchEquipmentAvailability',
  async (equipmentId: string, { rejectWithValue }) => {
    try {
      // TODO(api): replace with GET /equipment/{id}/availability
      await new Promise((resolve) => setTimeout(resolve, 300));

      return getMockAvailability(equipmentId);
    } catch {
      return rejectWithValue('Failed to load availability');
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<EquipmentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<GeoPoint>) => {
      state.userLocation = action.payload;
    },
    toggleCompareId: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.compareIds.includes(id)) {
        state.compareIds = state.compareIds.filter((item) => item !== id);
      } else if (state.compareIds.length < 3) {
        // WHY: cap at 3 so compare table fits on narrow phones
        state.compareIds.push(id);
      }
    },
    clearCompareIds: (state) => {
      state.compareIds = [];
    },
    clearSelectedEquipment: (state) => {
      state.selectedEquipment = null;
      state.availability = [];
    },
    hydrateEquipmentFromCache: (
      state,
      action: PayloadAction<{ searchResults: Equipment[]; lastFetchedAt: number | null }>,
    ) => {
      // WHY: only hydrate when Redux is empty to avoid overwriting in-flight fetch
      if (state.searchResults.length === 0) {
        state.searchResults = action.payload.searchResults;
        state.lastFetchedAt = action.payload.lastFetchedAt;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEquipment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.lastFetchedAt = Date.now();
        void saveJson(CACHE_KEYS.EQUIPMENT_SEARCH, action.payload);
        void saveJson(CACHE_KEYS.EQUIPMENT_META, { lastFetchedAt: state.lastFetchedAt });
      })
      .addCase(fetchEquipment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to load equipment';
      })
      .addCase(fetchEquipmentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEquipmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEquipment = action.payload;
      })
      .addCase(fetchEquipmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Equipment not found';
      })
      .addCase(fetchEquipmentAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setSearchQuery,
  setUserLocation,
  toggleCompareId,
  clearCompareIds,
  clearSelectedEquipment,
  hydrateEquipmentFromCache,
} = equipmentSlice.actions;

export default equipmentSlice.reducer;
