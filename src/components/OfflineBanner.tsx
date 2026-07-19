/**
 * @file        OfflineBanner.tsx
 * @feature     Core
 * @description Global banner when NetInfo reports no connectivity; sets user expectation for cached data.
 * @data        Redux `network.isOnline` updated by useAppBootstrap.
 * @consumes    useAppSelector, useSafeAreaInsets
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';

import { useAppSelector } from '../app/hooks';

/**
 * Fixed top banner below the status bar; hidden when online.
 * Amber colour distinguishes offline from primary-green in-app notifications.
 */
export function OfflineBanner() {
  const isOnline = useAppSelector((state) => state.network.isOnline);
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel="You are offline. Showing cached data where available."
      className="absolute left-0 right-0 z-50 flex-row items-center justify-center bg-amber-600 px-4 py-2"
      style={{ top: insets.top }}
    >
      <WifiOff size={16} color="#FFFFFF" />
      <Text className="ml-2 text-sm font-semibold text-white">
        You&apos;re offline — showing cached data
      </Text>
    </View>
  );
}
