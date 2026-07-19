/**
 * @file        MainNavigator.tsx
 * @feature     Navigation
 * @description Role-based switch that mounts the correct bottom-tab shell after login.
 * @navigation  RootStack > Main > (Farmer | Owner | Worker) tabs
 * @data        auth.role (Redux: FARMER | OWNER | WORKER)
 * @consumes    FarmerNavigator, OwnerNavigator, WorkerNavigator
 * @author      MiStarStudio
 */

import { useAppSelector } from '../app/hooks';
import { FarmerNavigator } from './FarmerNavigator';
import { OwnerNavigator } from './OwnerNavigator';
import { WorkerNavigator } from './WorkerNavigator';

/**
 * Dispatches to the tab navigator matching the signed-in user's role.
 * WHY: Each role has a distinct IA (tabs, stacks, initial screens); a single
 * switch here keeps role routing in one place instead of duplicating it per tab.
 * FARMER is the default so legacy or unset roles still land on the primary persona.
 */
export function MainNavigator() {
  const role = useAppSelector((state) => state.auth.role);

  switch (role) {
    case 'OWNER':
      return <OwnerNavigator />;
    case 'WORKER':
      return <WorkerNavigator />;
    case 'FARMER':
    default:
      return <FarmerNavigator />;
  }
}
