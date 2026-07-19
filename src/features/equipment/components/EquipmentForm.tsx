/**
 * @file        EquipmentForm.tsx
 * @feature     Equipment
 * @description Shared create/edit form for owner equipment listings.
 * @data        EquipmentFormValues
 * @consumes    ImagePicker, Location, MapView, CategoryChip, Input, Button
 * @author      MiStarStudio
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MapPin, X } from 'lucide-react-native';

import { Button, Input } from '../../../components';
import { ALL_CATEGORIES, CATEGORY_LABELS } from '../constants/categories';
import { CategoryChip } from './CategoryChip';
import { EquipmentCategory } from '../types/equipment.types';
import type { Equipment } from '../types/equipment.types';

/** Field values collected from the owner listing form. */
export interface EquipmentFormValues {
  name: string;
  category: EquipmentCategory;
  description: string;
  dailyRate: string;
  weeklyRate: string;
  latitude: number;
  longitude: number;
  locationName: string;
  images: string[];
  availabilityStart: string;
  availabilityEnd: string;
}

/** Props for add and edit screens sharing this form. */
export interface EquipmentFormProps {
  initialValues?: Partial<EquipmentFormValues>;
  equipment?: Equipment;
  submitLabel: string;
  onSubmit: (values: EquipmentFormValues) => Promise<void>;
  onDeactivate?: () => void;
  loading?: boolean;
}

const DEFAULT_VALUES: EquipmentFormValues = {
  name: '',
  category: EquipmentCategory.TRACTOR,
  description: '',
  dailyRate: '',
  weeklyRate: '',
  latitude: 5.6037,
  longitude: -0.187,
  locationName: '',
  images: [],
  availabilityStart: '',
  availabilityEnd: '',
};

/** Owner listing form with map pin, photos, rates, and optional deactivate. */
export function EquipmentForm({
  initialValues,
  equipment,
  submitLabel,
  onSubmit,
  onDeactivate,
  loading = false,
}: EquipmentFormProps) {
  const [form, setForm] = useState<EquipmentFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });

  const update = <K extends keyof EquipmentFormValues>(
    key: K,
    value: EquipmentFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Media & location handlers ─────────────────────────────────────────────

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6 - form.images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      update('images', [...form.images, ...uris].slice(0, 6));
    }
  };

  const useCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Location access is required to set your listing pin.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    update('latitude', location.coords.latitude);
    update('longitude', location.coords.longitude);

    const [place] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (place) {
      update(
        'locationName',
        [place.city, place.region].filter(Boolean).join(', ') || 'Current location',
      );
    }
  };

  const handleMapPress = (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    update('latitude', event.nativeEvent.coordinate.latitude);
    update('longitude', event.nativeEvent.coordinate.longitude);
  };

  // ─── Validation & submit ───────────────────────────────────────────────────

  const isValid =
    form.name.trim().length > 0 &&
    form.description.trim().length > 0 &&
    Number(form.dailyRate) > 0 &&
    Number(form.weeklyRate) > 0 &&
    form.locationName.trim().length > 0 &&
    form.images.length > 0;

  const handleSubmit = () => {
    if (!isValid) {
      Alert.alert('Incomplete form', 'Please fill all required fields and add at least one image.');
      return;
    }
    void onSubmit(form);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="gap-4 pb-8">
        {/* ─── Basic info ─── */}
        <Input
          label="Equipment Name"
          value={form.name}
          onChangeText={(name) => update('name', name)}
          placeholder="e.g. Massey Ferguson 375"
        />

        <View>
          <Text className="mb-2 text-sm font-medium text-text-primary">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ALL_CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={CATEGORY_LABELS[category]}
                selected={form.category === category}
                onPress={() => update('category', category)}
              />
            ))}
          </ScrollView>
        </View>

        <View>
          <Text className="mb-1.5 text-sm font-medium text-text-primary">Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(description) => update('description', description)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Describe condition, attachments, and best use cases..."
            placeholderTextColor="#9CA3AF"
            className="min-h-[100px] rounded-xl border border-gray-300 bg-surface px-3 py-3 text-base text-text-primary"
          />
        </View>

        {/* ─── Pricing ─── */}
        <Input
          label="Daily Rate (GHS)"
          value={form.dailyRate}
          onChangeText={(dailyRate) => update('dailyRate', dailyRate)}
          keyboardType="numeric"
          placeholder="180"
        />
        <Input
          label="Weekly Rate (GHS)"
          value={form.weeklyRate}
          onChangeText={(weeklyRate) => update('weeklyRate', weeklyRate)}
          keyboardType="numeric"
          placeholder="1100"
        />

        {/* ─── Location map ─── */}
        <View>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-text-primary">Location</Text>
            <Pressable onPress={useCurrentLocation} accessibilityRole="button">
              <Text className="text-sm font-semibold text-primary">Use current location</Text>
            </Pressable>
          </View>
          <MapView
            style={{ height: 180, borderRadius: 16 }}
            region={{
              latitude: form.latitude,
              longitude: form.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={{ latitude: form.latitude, longitude: form.longitude }}
              title={equipment?.name ?? 'Listing location'}
            />
          </MapView>
          <View className="mt-2 flex-row items-center">
            <MapPin size={16} color="#1A6B3A" />
            <Text className="ml-1 text-sm text-text-secondary">
              {form.locationName || 'Tap map to set pin'}
            </Text>
          </View>
          <Input
            label="Location Name"
            value={form.locationName}
            onChangeText={(locationName) => update('locationName', locationName)}
            placeholder="Kumasi, Ashanti"
          />
        </View>

        {/* ─── Photo gallery ─── */}
        <View>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-text-primary">Photos (up to 6)</Text>
            <Pressable
              onPress={pickImages}
              disabled={form.images.length >= 6}
              accessibilityRole="button"
            >
              <Text className="text-sm font-semibold text-primary">Add photos</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {form.images.map((uri, index) => (
              <View key={uri} className="relative">
                <Image source={{ uri }} className="h-20 w-20 rounded-xl bg-gray-200" />
                <Pressable
                  onPress={() =>
                    update(
                      'images',
                      form.images.filter((_, i) => i !== index),
                    )
                  }
                  className="absolute -right-1 -top-1 rounded-full bg-danger p-1"
                  accessibilityLabel="Remove image"
                >
                  <X size={12} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Availability window (submitted with listing payload) ─── */}
        <Input
          label="Availability Start (YYYY-MM-DD)"
          value={form.availabilityStart}
          onChangeText={(availabilityStart) => update('availabilityStart', availabilityStart)}
          placeholder="2026-07-01"
        />
        <Input
          label="Availability End (YYYY-MM-DD)"
          value={form.availabilityEnd}
          onChangeText={(availabilityEnd) => update('availabilityEnd', availabilityEnd)}
          placeholder="2026-12-31"
        />

        <Button
          label={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          disabled={!isValid}
          fullWidth
        />

        {onDeactivate ? (
          <View className="mt-2">
            <Button
              label="Deactivate Listing"
              onPress={onDeactivate}
              variant="danger"
              fullWidth
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
