/**
 * @file        EditEquipmentScreen.tsx
 * @feature     Equipment
 * @description Owner flow to update or deactivate an existing listing.
 * @navigation  EquipmentStack > EditEquipment | OwnerListingsStack > EditEquipment
 * @data        equipmentId route param
 * @consumes    EquipmentForm, getMockEquipmentById
 * @author      MiStarStudio
 */

import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenContainer, LoadingSpinner } from '../../../components';
import type {
  EquipmentStackParamList,
  OwnerListingsStackParamList,
} from '../../../navigation/types';
import { getMockEquipmentById } from '../data/mockEquipmentData';
import { EquipmentForm, type EquipmentFormValues } from '../components/EquipmentForm';

type Props =
  | NativeStackScreenProps<EquipmentStackParamList, 'EditEquipment'>
  | NativeStackScreenProps<OwnerListingsStackParamList, 'EditEquipment'>;

/** Pre-fills EquipmentForm from mock data; saves via PUT and supports deactivate. */
export function EditEquipmentScreen({ navigation, route }: Props) {
  const { equipmentId } = route.params;
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const equipment = getMockEquipmentById(equipmentId);

  useEffect(() => {
    // TODO(api): replace with GET /equipment/{id}
    const timer = setTimeout(() => setInitializing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (initializing) {
    return <LoadingSpinner label="Loading listing..." />;
  }

  if (!equipment) {
    return null;
  }

  const initialValues: Partial<EquipmentFormValues> = {
    name: equipment.name,
    category: equipment.category,
    description: equipment.description,
    dailyRate: String(equipment.dailyRate),
    weeklyRate: String(equipment.weeklyRate),
    latitude: equipment.latitude,
    longitude: equipment.longitude,
    locationName: equipment.locationName,
    images: equipment.images,
    // WHY: mock placeholder dates until availability API returns owner window
    availabilityStart: '2026-07-01',
    availabilityEnd: '2026-12-31',
  };

  const handleSubmit = async (_values: EquipmentFormValues) => {
    setLoading(true);
    try {
      // TODO(api): replace with PUT /equipment/{id}
      await new Promise((resolve) => setTimeout(resolve, 800));
      Alert.alert('Listing updated', 'Your changes have been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = () => {
    Alert.alert('Deactivate listing?', 'This equipment will no longer appear in search.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deactivate',
        style: 'destructive',
        onPress: async () => {
          // TODO(api): replace with PATCH /equipment/{id}/deactivate
          await new Promise((resolve) => setTimeout(resolve, 500));
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Edit equipment listing">
      <EquipmentForm
        equipment={equipment}
        initialValues={initialValues}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onDeactivate={handleDeactivate}
        loading={loading}
      />
    </ScreenContainer>
  );
}
