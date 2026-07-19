/**
 * @file        RevenueCard.tsx
 * @feature     Dashboard
 * @description Owner revenue summary card with amount, trend indicator, and mini sparkline chart.
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { TrendingDown, TrendingUp } from 'lucide-react-native';

/** Props for the monthly revenue hero card on the owner dashboard. */
export interface RevenueCardProps {
  amount: number;
  percentChange: number;
  sparklineData: number[];
  label?: string;
  periodLabel?: string;
}

function MiniSparkline({ data }: { data: number[] }) {
  const width = 120;
  const height = 40;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline
        points={points}
        fill="none"
        stroke="#1A6B3A"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Primary-colored card showing GHS amount, sparkline, and month-over-month percent change. */
export function RevenueCard({
  amount,
  percentChange,
  sparklineData,
  label = 'Revenue',
  periodLabel = 'This month',
}: RevenueCardProps) {
  const isPositive = percentChange >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? '#16A34A' : '#DC2626';

  return (
    <View className="rounded-2xl bg-primary p-5">
      <Text className="text-sm font-medium text-white/80">{periodLabel}</Text>
      <View className="mt-2 flex-row items-end justify-between">
        <View className="flex-1">
          <Text className="text-3xl font-bold text-white">
            GHS {amount.toLocaleString()}
          </Text>
          <Text className="mt-1 text-sm text-white/70">{label}</Text>
        </View>
        <MiniSparkline data={sparklineData} />
      </View>
      <View className="mt-4 flex-row items-center">
        <TrendIcon size={16} color={trendColor} />
        <Text className="ml-1 text-sm font-semibold" style={{ color: trendColor }}>
          {isPositive ? '+' : ''}
          {percentChange}%
        </Text>
        <Text className="ml-2 text-sm text-white/70">vs last month</Text>
      </View>
    </View>
  );
}
