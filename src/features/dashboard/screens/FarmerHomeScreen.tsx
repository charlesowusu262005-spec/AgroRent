/**
 * @file        FarmerHomeScreen.tsx
 * @feature     Dashboard
 * @description Farmer home tab — time-based greeting, quick actions, active bookings, and recommended equipment.
 * @navigation  FarmerTab > Home (initialRoute)
 * @data        RECOMMENDED_EQUIPMENT_IDS, MOCK_EQUIPMENT, booking slice
 * @consumes    QuickActions, ActiveBookingsList, EquipmentCard
 * @author      MiStarStudio
 */

import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Calendar, Headphones, MapPin, Search, Users } from 'lucide-react-native';

import { useAppSelector } from '../../../app/hooks';
import { ScreenContainer } from '../../../components';
import type { FarmerTabParamList } from '../../../navigation/types';
import { BookingStatus } from '../../booking/types/booking.types';
import { EquipmentCard } from '../../equipment/components/EquipmentCard';
import { MOCK_EQUIPMENT } from '../../equipment/data/mockEquipmentData';
import { ACCRA_CENTER } from '../../equipment/utils/distance';
import { ActiveBookingsList, QuickActions } from '../components';
import { RECOMMENDED_EQUIPMENT_IDS } from '../data/mockDashboardData';
import { getTimeGreeting } from '../utils/greeting';

type Props = BottomTabScreenProps<FarmerTabParamList, 'Home'>;

/** Farmer role home screen with shortcuts, booking strip, recommendations, and map CTA. */
export function FarmerHomeScreen({ navigation }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const userLocation = useAppSelector((state) => state.equipment.userLocation) ?? ACCRA_CENTER;
  const bookings = useAppSelector((state) => state.booking.bookingHistory);

  const displayName = user?.name ?? 'Farmer';
  const activeBookings = bookings.filter(
    (booking) =>
      (booking.farmerId === user?.id || booking.farmerName === 'Demo User') &&
      [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE].includes(
        booking.status,
      ),
  );

  // TODO(api): replace with GET /dashboard/farmer-summary — recommendedEquipment[], nearbyCount
  const recommendedEquipment = RECOMMENDED_EQUIPMENT_IDS.map((id) =>
    MOCK_EQUIPMENT.find((item) => item.id === id),
  ).filter((item): item is NonNullable<typeof item> => Boolean(item));

  const quickActions = [
    {
      id: 'find-equipment',
      label: 'Find Equipment',
      icon: <Search size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('Search', { screen: 'Search' }),
    },
    {
      id: 'hire-worker',
      label: 'Hire Worker',
      icon: <Users size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('LaborHub', { screen: 'Hub' }),
    },
    {
      id: 'my-bookings',
      label: 'My Bookings',
      icon: <Calendar size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('Bookings', { screen: 'History' }),
    },
    {
      id: 'support',
      label: 'Support',
      icon: <Headphones size={24} color="#1A6B3A" />,
      onPress: () =>
        Alert.alert('Support', 'Contact AgroRent support at support@agrorent.gh or +233 30 000 0000'),
    },
  ];

  return (
    <ScreenContainer className="px-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <View className="px-4 pb-2 pt-2">
          <Text className="text-2xl font-bold text-text-primary">
            {getTimeGreeting()}, {displayName.split(' ')[0]}
          </Text>
          <Text className="mt-1 text-sm text-text-secondary">
            What would you like to do today?
          </Text>
        </View>

        <View className="px-4">
          <QuickActions actions={quickActions} />
        </View>

        <View className="mt-2 px-4">
          <Text className="mb-3 text-lg font-semibold text-text-primary">Active Bookings</Text>
          <ActiveBookingsList
            bookings={activeBookings}
            layout="horizontal"
            emptyMessage="No active bookings right now"
            onBookingPress={(bookingId) =>
              navigation.navigate('Bookings', { screen: 'Detail', params: { bookingId } })
            }
          />
        </View>

        <View className="mt-6 px-4">
          <Text className="mb-3 text-lg font-semibold text-text-primary">Recommended Equipment</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedEquipment.map((equipment) => (
              <View key={equipment.id} className="mr-3 w-72">
                <EquipmentCard
                  equipment={equipment}
                  userLocation={userLocation}
                  onPress={() =>
                    navigation.navigate('Search', {
                      screen: 'Detail',
                      params: { equipmentId: equipment.id },
                    })
                  }
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-6 px-4">
          <Text className="mb-3 text-lg font-semibold text-text-primary">Nearby</Text>
          <Pressable
            onPress={() => navigation.navigate('Search', { screen: 'Map' })}
            accessibilityRole="button"
            className="overflow-hidden rounded-2xl bg-primary/10 p-4 active:opacity-90"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-text-primary">
                  Equipment near you
                </Text>
                <Text className="mt-1 text-sm text-text-secondary">
                  {/* TODO(api): replace with GET /dashboard/farmer-summary nearbyCount */}
                  {MOCK_EQUIPMENT.length} listings on the map around Greater Accra
                </Text>
              </View>
              <View className="rounded-full bg-primary p-3">
                <MapPin size={22} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
