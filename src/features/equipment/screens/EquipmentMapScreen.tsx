/**
 * @file        EquipmentMapScreen.tsx
 * @feature     Equipment
 * @description Map view of search results with price markers and bottom preview card.
 * @navigation  EquipmentStack > Map
 * @data        searchResults, userLocation, filters, searchQuery
 * @consumes    fetchEquipment, MapView, Marker
 * @author      MiStarStudio
 */

import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import MapView, { Callout, Marker } from 'react-native-maps';
import { List, X } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Card, StarRating } from '../../../components';
import type { EquipmentStackParamList } from '../../../navigation/types';
import { fetchEquipment, setUserLocation } from '../slices/equipmentSlice';
import type { Equipment } from '../types/equipment.types';
import { formatDistance, getDistanceKm } from '../utils/distance';

type Props = NativeStackScreenProps<EquipmentStackParamList, 'Map'>;

/** Full-screen map alternative to the search list view. */
export function EquipmentMapScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { searchResults, filters, searchQuery, userLocation } = useAppSelector(
    (state) => state.equipment,
  );
  const [selected, setSelected] = useState<Equipment | null>(null);

  useEffect(() => {
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({});
        dispatch(
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
      }
      void dispatch(
        fetchEquipment({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          filters,
          query: searchQuery,
        }),
      );
    })();
  }, [dispatch, filters, searchQuery, userLocation.latitude, userLocation.longitude]);

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4,
        }}
        showsUserLocation
      >
        {searchResults.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            onPress={() => setSelected(item)}
          >
            <View className="rounded-full bg-primary px-2 py-1">
              <Text className="text-xs font-bold text-white">GHS {item.dailyRate}</Text>
            </View>
            <Callout onPress={() => navigation.navigate('Detail', { equipmentId: item.id })}>
              <View className="w-40 p-2">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-sm">GHS {item.dailyRate}/day</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Pressable
        onPress={() => navigation.goBack()}
        className="absolute left-4 top-14 rounded-full bg-surface p-3 shadow-sm"
        accessibilityRole="button"
        accessibilityLabel="Back to list view"
      >
        <List size={20} color="#1A6B3A" />
      </Pressable>

      {selected ? (
        <View className="absolute bottom-6 left-4 right-4">
          <Card onPress={() => navigation.navigate('Detail', { equipmentId: selected.id })}>
            <View className="flex-row">
              <Image
                source={{ uri: selected.images[0] }}
                className="h-20 w-20 rounded-xl bg-gray-200"
              />
              <View className="ml-3 flex-1">
                <View className="flex-row items-start justify-between">
                  <Text className="flex-1 text-base font-semibold text-text-primary" numberOfLines={1}>
                    {selected.name}
                  </Text>
                  <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                    <X size={18} color="#6B7280" />
                  </Pressable>
                </View>
                <Text className="mt-1 text-sm font-bold text-primary">
                  GHS {selected.dailyRate}/day
                </Text>
                <View className="mt-1 flex-row items-center justify-between">
                  <StarRating rating={selected.avgRating} size={12} />
                  <Text className="text-xs text-text-secondary">
                    {formatDistance(
                      getDistanceKm(
                        userLocation.latitude,
                        userLocation.longitude,
                        selected.latitude,
                        selected.longitude,
                      ),
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>
      ) : null}
    </View>
  );
}
