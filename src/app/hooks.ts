/**
 * @file        hooks.ts
 * @feature     Core
 * @description Typed Redux hooks wrapping react-redux for the AgroRent store.
 * @data        RootState, AppDispatch from store.ts
 * @author      MiStarStudio
 */

import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

/** Typed dispatch hook — use instead of plain useDispatch. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
/** Typed selector hook — use instead of plain useSelector. */
export const useAppSelector = useSelector.withTypes<RootState>();
