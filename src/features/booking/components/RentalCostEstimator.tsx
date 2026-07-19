/**
 * @file        RentalCostEstimator.tsx
 * @feature     Booking
 * @description Breakdown panel for daily rate, total days, and computed rental cost in GHS.
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';

/** Props for the rental cost summary shown during request and payment flows. */
export interface RentalCostEstimatorProps {
  totalDays: number;
  dailyRate: number;
  totalCost: number;
}

/** Read-only cost breakdown — parent computes values via bookingCalculations helpers. */
export function RentalCostEstimator({
  totalDays,
  dailyRate,
  totalCost,
}: RentalCostEstimatorProps) {
  return (
    <View className="rounded-2xl border border-gray-200 bg-surface p-4">
      <Text className="mb-3 text-base font-semibold text-text-primary">Rental estimate</Text>
      <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
        <Text className="text-sm text-text-secondary">Daily rate</Text>
        <Text className="text-sm font-medium text-text-primary">GHS {dailyRate}</Text>
      </View>
      <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
        <Text className="text-sm text-text-secondary">Total days</Text>
        <Text className="text-sm font-medium text-text-primary">{totalDays}</Text>
      </View>
      <View className="flex-row items-center justify-between pt-3">
        <Text className="text-base font-semibold text-text-primary">Total cost</Text>
        <Text className="text-xl font-bold text-primary">GHS {totalCost}</Text>
      </View>
      {totalDays > 0 ? (
        <Text className="mt-2 text-xs text-text-muted">
          {totalDays} day{totalDays !== 1 ? 's' : ''} × GHS {dailyRate} = GHS {totalCost}
        </Text>
      ) : (
        <Text className="mt-2 text-xs text-text-muted">Select dates to see your total</Text>
      )}
    </View>
  );
}
