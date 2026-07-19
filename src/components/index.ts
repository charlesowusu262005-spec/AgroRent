/**
 * @file        index.ts
 * @feature     Design System
 * @description Barrel export for all shared UI primitives and global shell components.
 * @data        Re-exports only — no runtime logic.
 * @author      MiStarStudio
 */

export { AppShell } from './AppShell';
export { CachedImage } from './CachedImage';
export type { CachedImageProps } from './CachedImage';

export { ErrorBoundary } from './ErrorBoundary';

export { InAppNotificationBanner } from './InAppNotificationBanner';
export { OfflineBanner } from './OfflineBanner';

export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';

export { Badge, DEFAULT_STATUS_COLOR_MAP } from './Badge';
export type { BadgeProps } from './Badge';

export { BottomSheet } from './BottomSheet';
export type { BottomSheetProps } from './BottomSheet';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant } from './Button';

export { Card } from './Card';
export type { CardProps, CardPadding } from './Card';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { Input } from './Input';
export type { InputProps } from './Input';

export { LoadingSpinner } from './LoadingSpinner';
export type { LoadingSpinnerProps } from './LoadingSpinner';

export { ScreenContainer } from './ScreenContainer';
export type { ScreenContainerProps } from './ScreenContainer';

export { StarRating } from './StarRating';
export type { StarRatingProps } from './StarRating';

export { Snackbar } from './Snackbar';
export type { SnackbarProps } from './Snackbar';
