/**
 * @file        ProfileScreen.tsx
 * @feature     Profile
 * @description Main profile hub — avatar, role badge, role-specific shortcuts, and settings menu.
 * @navigation  ProfileStack > Profile (initialRoute)
 * @data        fetchProfile, logoutUser, setProfileAvatar
 * @consumes    ProfileAvatar, ProfileMenuItem, Card
 * @author      MiStarStudio
 */

import { useEffect } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import {
  Award,
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  Package,
  Pencil,
  ShieldCheck,
} from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Card, LoadingSpinner, ScreenContainer } from '../../../components';
import { roleLabel } from '../../auth/utils/mockAuth';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  FarmerTabParamList,
  OwnerTabParamList,
  ProfileStackParamList,
  WorkerTabParamList,
} from '../../../navigation/types';
import { ProfileAvatar, ProfileMenuItem } from '../components';
import {
  fetchProfile,
  logoutUser,
  setProfileAvatar,
} from '../slices/profileSlice';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

/** Profile home with avatar picker, role shortcuts, and account menu items. */
export function ProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { profile, notifications, isLoading } = useAppSelector((state) => state.profile);
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    void dispatch(fetchProfile());
  }, [dispatch]);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      dispatch(setProfileAvatar(result.assets[0].uri));
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => void dispatch(logoutUser()),
      },
    ]);
  };

  const tabNavigation = navigation.getParent<
    BottomTabNavigationProp<FarmerTabParamList & OwnerTabParamList & WorkerTabParamList>
  >();

  if (isLoading && !profile) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  if (!profile) {
    return (
      <ScreenContainer>
        <Text className="text-center text-text-secondary">Profile unavailable</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <View className="items-center px-4 pb-6 pt-4">
          <ProfileAvatar
            name={profile.name}
            imageUrl={profile.avatarUrl}
            editable
            onPress={() => void pickAvatar()}
          />
          <Text className="mt-4 text-2xl font-bold text-text-primary">{profile.name}</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-xs font-semibold uppercase text-primary">
                {roleLabel(profile.role)}
              </Text>
            </View>
            {profile.verified ? (
              <View className="flex-row items-center rounded-full bg-green-100 px-2.5 py-1">
                <ShieldCheck size={14} color="#16A34A" />
                <Text className="ml-1 text-xs font-semibold text-green-700">Verified</Text>
              </View>
            ) : null}
          </View>
          {profile.region ? (
            <Text className="mt-2 text-sm text-text-secondary">{profile.region}</Text>
          ) : null}
        </View>

        {profile.role === 'OWNER' ? (
          <View className="mx-4 mb-4">
            <Card padding="md" onPress={() => tabNavigation?.navigate('Listings', { screen: 'MyListings' })}>
              <View className="flex-row items-center">
                <Package size={22} color="#1A6B3A" />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-text-primary">My Listings</Text>
                  <Text className="text-sm text-text-secondary">Manage your equipment</Text>
                </View>
              </View>
            </Card>
          </View>
        ) : null}

        {profile.role === 'WORKER' ? (
          <View className="mx-4 mb-4">
            <Card padding="md" onPress={() => navigation.navigate('EditProfile')}>
              <View className="flex-row items-center">
                <Award size={22} color="#1A6B3A" />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-text-primary">
                    My Skills & Certifications
                  </Text>
                  <Text className="text-sm text-text-secondary">
                    {profile.skills?.length ?? 0} skills · {profile.certifications?.length ?? 0}{' '}
                    certs
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        ) : null}

        <View className="mx-4 mb-4 overflow-hidden rounded-2xl bg-surface shadow-sm">
          <ProfileMenuItem
            icon={<Pencil size={20} color="#1A6B3A" />}
            label="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <ProfileMenuItem
            icon={<Bell size={20} color="#1A6B3A" />}
            label="Notifications"
            badge={unreadCount > 0 ? String(unreadCount) : undefined}
            onPress={() => navigation.navigate('Notifications')}
          />
          <ProfileMenuItem
            icon={<CreditCard size={20} color="#1A6B3A" />}
            label="Payment Methods"
            onPress={() =>
              Alert.alert('Payment Methods', 'MoMo wallet management coming in a future update.')
            }
          />
          <ProfileMenuItem
            icon={<HelpCircle size={20} color="#1A6B3A" />}
            label="Help & Support"
            onPress={() =>
              Alert.alert('Help & Support', 'Email support@agrorent.gh or call +233 30 000 0000')
            }
          />
          <ProfileMenuItem
            icon={<FileText size={20} color="#1A6B3A" />}
            label="Terms & Privacy"
            onPress={() =>
              Alert.alert('Terms & Privacy', 'Legal documents will be available on agrorent.gh')
            }
          />
          <ProfileMenuItem
            icon={<LogOut size={20} color="#DC2626" />}
            label="Logout"
            destructive
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
