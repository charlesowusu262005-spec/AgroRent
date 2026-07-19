/**
 * @file        CancellationPolicyCard.tsx
 * @feature     Booking
 * @description Static policy summary shown before cancel or during booking detail review.
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';

import { Card } from '../../../components';

/** Displays AgroRent Ghana standard cancellation terms — content will move to CMS later. */
export function CancellationPolicyCard() {
  return (
    <Card padding="md">
      <View className="flex-row items-start">
        <View className="mr-3 rounded-full bg-primary/10 p-2">
          <Shield size={20} color="#1A6B3A" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-text-primary">Cancellation policy</Text>
          <Text className="mt-2 text-sm leading-5 text-text-secondary">
            Free cancellation up to 24 hours before the rental start date. Cancellations within
            24 hours may incur a 50% charge. No-shows are charged the full rental amount.
          </Text>
        </View>
      </View>
    </Card>
  );
}
