/**
 * @file        RootNavigator.tsx
 * @feature     Navigation
 * @description Top-level native stack that gates the app between Auth and Main flows.
 * @navigation  App root > RootStack (Auth | Main)
 * @data        auth.isAuthenticated (Redux)
 * @consumes    AuthNavigator, MainNavigator, hiddenHeaderOptions
 * @author      MiStarStudio
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppSelector } from '../app/hooks';
import { AuthNavigator } from './AuthNavigator';
import { hiddenHeaderOptions } from './options';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root navigator — single entry point mounted inside NavigationContainer.
 * WHY: Auth vs Main is decided at the root so no protected screen can mount
 * before the session is valid; unauthenticated users never see role tabs.
 */
export function RootNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={hiddenHeaderOptions}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
