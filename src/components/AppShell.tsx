/**
 * @file        AppShell.tsx
 * @feature     Core
 * @description Root UI shell that boots offline cache, push listeners, and global banners.
 * @data        Redux network + appUi slices; see useAppBootstrap.
 * @consumes    useAppBootstrap, OfflineBanner, InAppNotificationBanner
 * @author      MiStarStudio
 */

import type { ReactNode } from 'react';

import { useAppBootstrap } from '../hooks/useAppBootstrap';
import { InAppNotificationBanner } from './InAppNotificationBanner';
import { OfflineBanner } from './OfflineBanner';

/**
 * Wraps navigators after Redux Provider so bootstrap hooks can dispatch.
 * Banners overlay navigation without blocking touches to underlying screens.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useAppBootstrap();

  return (
    <>
      {children}
      <OfflineBanner />
      <InAppNotificationBanner />
    </>
  );
}
