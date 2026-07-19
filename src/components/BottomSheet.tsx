/**
 * @file        BottomSheet.tsx
 * @feature     Design System
 * @description Modal bottom sheet for filters and secondary actions (equipment filters, etc.).
 * @data        Presentational — children supplied by parent.
 * @consumes    @gorhom/bottom-sheet BottomSheetModal
 * @author      MiStarStudio
 */

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

/** Props controlling sheet visibility and snap heights. */
export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Fractional or pixel snap points; defaults suit filter panels. */
  snapPoints?: (string | number)[];
  title?: string;
  accessibilityLabel?: string;
}

/**
 * Imperatively presents/dismisses a gorhom modal sheet from `isOpen` prop.
 * Backdrop tap closes the sheet so users are not trapped behind filters.
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints: snapPointsProp,
  title,
  accessibilityLabel,
}: BottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(
    () => snapPointsProp ?? ['40%', '75%'],
    [snapPointsProp],
  );

  // ─── Effects ───
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  // ─── Render ───
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      accessibilityLabel={accessibilityLabel ?? title ?? 'Bottom sheet'}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
      backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
    >
      <BottomSheetView className="flex-1 px-4 pb-8">
        {title ? (
          <Text className="mb-4 text-center text-lg font-semibold text-text-primary">
            {title}
          </Text>
        ) : null}
        <View className="flex-1">{children}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
