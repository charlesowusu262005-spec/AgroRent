/**
 * @file        PlaceholderScreen.tsx
 * @feature     Navigation
 * @description Dev/scaffold screen shown when a route exists but the real UI is not built yet.
 * @navigation  Ad-hoc via createPlaceholderScreen (not wired in production navigators)
 * @data        route.name or optional title prop
 * @consumes    @react-navigation/native useRoute
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

/** Props for PlaceholderScreen; title overrides the route name in the label. */
export interface PlaceholderScreenProps {
  title?: string;
}

/**
 * Minimal centered label for stub routes during navigation scaffolding.
 * WHY exists: lets navigators be typed and wired before feature screens land.
 */
export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  const route = useRoute();
  const screenName = title ?? route.name;

  return (
    <View
      accessibilityRole="header"
      className="flex-1 items-center justify-center bg-background px-4"
    >
      <Text className="text-xl font-semibold text-text-primary">{screenName}</Text>
    </View>
  );
}

/**
 * Factory for stack screen components that render a titled placeholder.
 * @param title - Display name shown when route.name is not sufficient.
 */
export function createPlaceholderScreen(title: string) {
  return function Screen() {
    return <PlaceholderScreen title={title} />;
  };
}
