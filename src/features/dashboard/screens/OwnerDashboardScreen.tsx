/**
 * @file        OwnerDashboardScreen.tsx
 * @feature     Dashboard
 * @description Owner home tab — monthly revenue, pending bookings, listing stats carousel, and quick actions.
 * @navigation  OwnerTab > Dashboard (initialRoute)
 * @data        MOCK_OWNER_SUMMARY, getOwnerListings, booking slice
 * @consumes    RevenueCard, ActiveBookingsList, QuickActions
 * @author      MiStarStudio
 */

import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BarChart3, Calendar, Plus } from 'lucide-react-native';

import { useAppSelector } from '../../../app/hooks';
import { Card, ScreenContainer } from '../../../components';
import type { OwnerTabParamList } from '../../../navigation/types';
import { BookingStatus } from '../../booking/types/booking.types';
import { ActiveBookingsList, QuickActions, RevenueCard } from '../components';
import { getOwnerListings, MOCK_OWNER_SUMMARY, DEMO_OWNER_ID } from '../data/mockDashboardData';

type Props = BottomTabScreenProps<OwnerTabParamList, 'Dashboard'>;

/** Owner role dashboard with revenue card, booking queue, and horizontal listings overview. */
export function OwnerDashboardScreen({ navigation }: Props) {
  const bookings = useAppSelector((state) => state.booking.bookingHistory);
  const ownerId = useAppSelector((state) => state.auth.user?.id) ?? DEMO_OWNER_ID;
  // TODO(api): replace with GET /dashboard/owner-summary — revenue, sparkline, listing stats
  const ownerListings = getOwnerListings(ownerId);

  const pendingBookings = bookings.filter((booking) => booking.status === BookingStatus.PENDING);
  const activeBookings = bookings.filter((booking) =>
    [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE].includes(booking.status),
  );

  const quickActions = [
    {
      id: 'add-equipment',
      label: 'Add Equipment',
      icon: <Plus size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('Listings', { screen: 'AddEquipment' }),
    },
    {
      id: 'view-bookings',
      label: 'View All Bookings',
      icon: <Calendar size={24} color="#1A6B3A" />,
      onPress: () => navigation.navigate('Bookings', { screen: 'Management' }),
    },
    {
      id: 'earnings-report',
      label: 'Earnings Report',
      icon: <BarChart3 size={24} color="#1A6B3A" />,
      onPress: () =>
        Alert.alert(
          'Earnings Report',
          `This month: GHS ${MOCK_OWNER_SUMMARY.monthlyRevenue.toLocaleString()}\nDetailed reports coming soon.`,
        ),
    },
  ];

  return (
    <ScreenContainer className="px-0">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <View className="px-4 pb-2 pt-2">
          <Text className="text-2xl font-bold text-text-primary">Owner Dashboard</Text>
          <Text className="mt-1 text-sm text-text-secondary">Overview of your rental business</Text>
        </View>

        <View className="px-4">
          <RevenueCard
            amount={MOCK_OWNER_SUMMARY.monthlyRevenue}
            percentChange={MOCK_OWNER_SUMMARY.percentChange}
            sparklineData={MOCK_OWNER_SUMMARY.sparklineData}
          />
        </View>

        <View className="mt-6 px-4">
          <Text className="mb-3 text-lg font-semibold text-text-primary">
            Pending requests
            {pendingBookings.length > 0 ? (
              <Text className="text-accent"> ({pendingBookings.length})</Text>
            ) : null}
          </Text>
          <ActiveBookingsList
            bookings={activeBookings}
            layout="vertical"
            highlightPending
            showFarmer
            emptyMessage="No bookings need your attention"
            onBookingPress={(bookingId) =>
              navigation.navigate('Bookings', { screen: 'Detail', params: { bookingId } })
            }
          />
        </View>

        <View className="mt-6 px-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-text-primary">My Listings</Text>
            <Pressable onPress={() => navigation.navigate('Listings', { screen: 'MyListings' })}>
              <Text className="text-sm font-semibold text-primary">View all</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ownerListings.map(({ equipment, views, bookingsCount }) => (
              <Pressable
                key={equipment.id}
                onPress={() =>
                  navigation.navigate('Listings', {
                    screen: 'EditEquipment',
                    params: { equipmentId: equipment.id },
                  })
                }
                className="mr-3 w-56"
              >
                <Card padding="none">
                  <Image
                    source={{ uri: equipment.images[0] }}
                    className="h-28 w-full rounded-t-2xl bg-gray-200"
                  />
                  <View className="p-3">
                    <Text className="text-sm font-semibold text-text-primary" numberOfLines={1}>
                      {equipment.name}
                    </Text>
                    <Text className="mt-1 text-xs text-text-secondary">
                      GHS {equipment.dailyRate}/day
                    </Text>
                    <View className="mt-3 flex-row justify-between">
                      <Text className="text-xs text-text-muted">{views} views</Text>
                      <Text className="text-xs font-semibold text-primary">
                        {bookingsCount} bookings
                      </Text>
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="mt-6 px-4">
          <Text className="mb-3 text-lg font-semibold text-text-primary">Quick Actions</Text>
          <QuickActions actions={quickActions} columns={2} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
