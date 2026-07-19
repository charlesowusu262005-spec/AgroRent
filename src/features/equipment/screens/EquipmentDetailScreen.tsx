/**
 * @file        EquipmentDetailScreen.tsx
 * @feature     Equipment
 * @description Full listing detail with pricing toggle, map, reviews, availability, and book CTA.
 * @navigation  EquipmentStack > Detail
 * @data        equipmentId route param, selectedEquipment, availability
 * @consumes    fetchEquipmentById, fetchEquipmentAvailability, ReviewList
 * @author      MiStarStudio
 */

import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, LoadingSpinner, StarRating } from '../../../components';
import type { EquipmentStackParamList } from '../../../navigation/types';
import {
  AvailabilityCalendar,
  EquipmentImageCarousel,
  OwnerInfoCard,
} from '../components';
import { ReviewList } from '../../reviews/components';
import { CATEGORY_LABELS } from '../constants/categories';
import {
  fetchEquipmentAvailability,
  fetchEquipmentById,
} from '../slices/equipmentSlice';

type Props = NativeStackScreenProps<EquipmentStackParamList, 'Detail'>;
type PricePeriod = 'daily' | 'weekly';

/** Equipment detail with sticky "Book Now" footer navigating to Bookings stack. */
export function EquipmentDetailScreen({ navigation, route }: Props) {
  const { equipmentId } = route.params;
  const dispatch = useAppDispatch();
  const { selectedEquipment, availability, isLoading } = useAppSelector(
    (state) => state.equipment,
  );
  const [pricePeriod, setPricePeriod] = useState<PricePeriod>('daily');

  useEffect(() => {
    void dispatch(fetchEquipmentById(equipmentId));
    void dispatch(fetchEquipmentAvailability(equipmentId));
  }, [dispatch, equipmentId]);

  if (isLoading || !selectedEquipment) {
    return <LoadingSpinner label="Loading equipment details..." />;
  }

  const equipment = selectedEquipment;
  const price =
    pricePeriod === 'daily' ? equipment.dailyRate : equipment.weeklyRate;
  const priceLabel = pricePeriod === 'daily' ? '/day' : '/week';

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* ─── Hero & pricing ─── */}
        <EquipmentImageCarousel images={equipment.images} />

        <View className="px-4 pt-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-2xl font-bold text-text-primary">{equipment.name}</Text>
              <Text className="mt-1 text-sm text-text-secondary">{equipment.locationName}</Text>
            </View>
            <View className="rounded-full bg-primary/10 px-2.5 py-1">
              <Text className="text-xs font-semibold text-primary">
                {CATEGORY_LABELS[equipment.category]}
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row items-center">
            <StarRating rating={equipment.avgRating} size={18} />
            <Text className="ml-2 text-sm text-text-secondary">
              {equipment.avgRating} ({equipment.reviewCount} reviews)
            </Text>
          </View>

          <View className="mt-5 flex-row rounded-xl bg-gray-100 p-1">
            {(['daily', 'weekly'] as PricePeriod[]).map((period) => (
              <View key={period} className="flex-1">
                <Button
                  label={period === 'daily' ? 'Daily' : 'Weekly'}
                  variant={pricePeriod === period ? 'primary' : 'ghost'}
                  onPress={() => setPricePeriod(period)}
                  fullWidth
                />
              </View>
            ))}
          </View>
          <Text className="mt-3 text-3xl font-bold text-primary">
            GHS {price}
            <Text className="text-base font-normal text-text-secondary">{priceLabel}</Text>
          </Text>

          {/* ─── Owner & description ─── */}
          <View className="mt-6">
            <OwnerInfoCard equipment={equipment} />
          </View>

          <View className="mt-6">
            <Text className="mb-2 text-lg font-semibold text-text-primary">Description</Text>
            <Text className="text-base leading-6 text-text-secondary">
              {equipment.description}
            </Text>
          </View>

          {/* ─── Map pin ─── */}
          <View className="mt-6">
            <Text className="mb-2 text-lg font-semibold text-text-primary">Location</Text>
            <MapView
              style={{ height: 160, borderRadius: 16 }}
              scrollEnabled={false}
              region={{
                latitude: equipment.latitude,
                longitude: equipment.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: equipment.latitude,
                  longitude: equipment.longitude,
                }}
                title={equipment.name}
              />
            </MapView>
          </View>

          {/* ─── Reviews ─── */}
          <View className="mt-6">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-text-primary">Reviews</Text>
              <Button
                label="Write Review"
                variant="secondary"
                onPress={() =>
                  navigation.navigate('SubmitReview', {
                    targetId: equipmentId,
                    targetType: 'EQUIPMENT',
                    targetName: equipment.name,
                  })
                }
              />
            </View>
            <ReviewList targetId={equipmentId} targetType="EQUIPMENT" />
          </View>

          {/* ─── Availability calendar ─── */}
          <View className="mt-6 pb-28">
            <Text className="mb-3 text-lg font-semibold text-text-primary">Availability</Text>
            <AvailabilityCalendar bookedRanges={availability} />
          </View>
        </View>
      </ScrollView>

      {/* WHY: sticky footer keeps book action visible while scrolling long detail */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-surface px-4 py-4">
        <Button
          label="Book Now"
          onPress={() =>
            navigation.getParent()?.navigate('Bookings', {
              screen: 'Request',
              params: { equipmentId },
            })
          }
          fullWidth
        />
      </View>
    </View>
  );
}
