/**
 * @file        store.ts
 * @feature     Core
 * @description Redux Toolkit root store combining feature slices and global app/network state.
 * @data        auth, equipment, booking, payment, labor, review, profile, network, appUi reducers
 * @author      MiStarStudio
 */

import { configureStore } from '@reduxjs/toolkit';

import appUiReducer from './slices/appUiSlice';
import networkReducer from './slices/networkSlice';
import authReducer from '../features/auth/slices/authSlice';
import bookingReducer from '../features/booking/slices/bookingSlice';
import equipmentReducer from '../features/equipment/slices/equipmentSlice';
import laborReducer from '../features/labor/slices/laborSlice';
import paymentReducer from '../features/payment/slices/paymentSlice';
import profileReducer from '../features/profile/slices/profileSlice';
import reviewReducer from '../features/reviews/slices/reviewSlice';

/** Configured Redux store — single source of truth for all feature domains. */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    labor: laborReducer,
    review: reviewReducer,
    profile: profileReducer,
    network: networkReducer,
    appUi: appUiReducer,
  },
});

/** Inferred root state type for selectors and typed hooks. */
export type RootState = ReturnType<typeof store.getState>;
/** Inferred dispatch type including thunk middleware. */
export type AppDispatch = typeof store.dispatch;
