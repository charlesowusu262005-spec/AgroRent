/**
 * @file        SplashScreen.tsx
 * @feature     Auth
 * @description Branded launch screen with auto-redirect to login — first screen in the unauthenticated stack.
 * @data        None; navigates to Login without API call
 * @navigation  Splash → Login (auto after 1.5s or on tap)
 * @consumes    lucide-react-native, expo-status-bar, navigation/types
 * @author      MiStarStudio
 */

import { useCallback, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

/**
 * Brief brand moment before login. replace() prevents back-navigation to splash
 * once the user reaches the auth flow.
 */
export function SplashScreen({ navigation }: Props) {
  const goToLogin = useCallback(() => {
    navigation.replace('Login');
  }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(goToLogin, 1500);
    return () => clearTimeout(timer);
  }, [goToLogin]);

  return (
    <Pressable
      onPress={goToLogin}
      accessibilityRole="button"
      accessibilityLabel="AgroRent Ghana splash screen. Tap to continue."
      className="flex-1 items-center justify-center bg-primary"
    >
      <StatusBar style="light" />
      <View className="mb-4 rounded-full bg-white/15 p-5">
        <Sprout size={56} color="#FFFFFF" />
      </View>
      <Text className="text-3xl font-bold text-white">AgroRent</Text>
      <Text className="mt-1 text-lg font-medium text-white/90">Ghana</Text>
      <Text className="mt-6 text-sm text-white/70">Farm equipment rental made simple</Text>
    </Pressable>
  );
}
