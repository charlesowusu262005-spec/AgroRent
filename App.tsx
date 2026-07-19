import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { store } from './src/app/store';
import { AppShell, ErrorBoundary } from './src/components';
import { RootNavigator } from './src/navigation';
import { navigationRef } from './src/navigation/navigationRef';

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <ErrorBoundary>
          <Provider store={store}>
            <BottomSheetModalProvider>
              <NavigationContainer ref={navigationRef}>
                <AppShell>
                  <RootNavigator />
                </AppShell>
              </NavigationContainer>
            </BottomSheetModalProvider>
          </Provider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
