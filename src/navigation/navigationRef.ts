/**
 * @file        navigationRef.ts
 * @feature     Navigation
 * @description Imperative navigation ref for use outside the React tree (e.g. auth logout, push handlers).
 * @navigation  Bound to NavigationContainer ref at app root
 * @data        RootStackParamList (typed navigate targets)
 * @consumes    @react-navigation/native NavigationContainerRef
 * @author      MiStarStudio
 */

import { createRef } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/**
 * Ref attached to NavigationContainer for navigate/reset from non-component code.
 * WHY module-level ref: Redux middleware, token expiry, and notification services
 * cannot call useNavigation(); this ref is the escape hatch for imperative routing.
 */
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();
