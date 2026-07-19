/**
 * @file        OwnerListingsScreen.tsx
 * @feature     Equipment
 * @description Owner dashboard listing active equipment with add/edit navigation.
 * @navigation  OwnerListingsStack > MyListings (initialRoute)
 * @data        MOCK_EQUIPMENT (filtered by isActive)
 * @consumes    EquipmentCard
 * @author      MiStarStudio
 */

import { FlatList, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EmptyState, ScreenContainer } from '../../../components';
import { Package } from 'lucide-react-native';
import { EquipmentCard } from '../components';
import { MOCK_EQUIPMENT } from '../data/mockEquipmentData';
import { ACCRA_CENTER } from '../utils/distance';
import type { OwnerListingsStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<OwnerListingsStackParamList, 'MyListings'>;

/** Shows owner's active listings; tap card to edit, + to add new. */
export function OwnerListingsScreen({ navigation }: Props) {
  const ownerId = useAppSelector((state) => state.auth.user?.id);
  // TODO(api): replace with GET /equipment/mine — filter by authenticated ownerId
  const listings = MOCK_EQUIPMENT.filter(
    (item) => item.isActive && (!ownerId || item.ownerId === ownerId),
  );

  return (
    <ScreenContainer className="px-0">
      <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
        <Text className="text-2xl font-bold text-text-primary">My Listings</Text>
        <Pressable
          onPress={() => navigation.navigate('AddEquipment')}
          accessibilityRole="button"
          accessibilityLabel="Add new listing"
          className="rounded-full bg-primary p-2"
        >
          <Plus size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6"
        ListEmptyComponent={
          <EmptyState
            icon={<Package size={32} color="#9CA3AF" />}
            title="No listings yet"
            subtitle="Tap + to add your first equipment listing"
            actionLabel="Add Equipment"
            onAction={() => navigation.navigate('AddEquipment')}
          />
        }
        renderItem={({ item }) => (
          <EquipmentCard
            equipment={item}
            // WHY: distance not meaningful for own listings; Accra used as neutral default
            userLocation={ACCRA_CENTER}
            onPress={() => navigation.navigate('EditEquipment', { equipmentId: item.id })}
          />
        )}
      />
    </ScreenContainer>
  );
}
