/**
 * @file        AddEquipmentScreen.tsx
 * @feature     Equipment
 * @description Owner flow to publish a new equipment rental listing.
 * @navigation  EquipmentStack > AddEquipment | OwnerListingsStack > AddEquipment
 * @consumes    EquipmentForm
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenContainer } from '../../../components';
import type {
  EquipmentStackParamList,
  OwnerListingsStackParamList,
} from '../../../navigation/types';
import { EquipmentForm, type EquipmentFormValues } from '../components/EquipmentForm';

type Props =
  | NativeStackScreenProps<EquipmentStackParamList, 'AddEquipment'>
  | NativeStackScreenProps<OwnerListingsStackParamList, 'AddEquipment'>;

/** Wraps EquipmentForm and submits a new listing via POST (mocked). */
export function AddEquipmentScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (_values: EquipmentFormValues) => {
    setLoading(true);
    try {
      // TODO(api): replace with POST /equipment
      await new Promise((resolve) => setTimeout(resolve, 800));
      Alert.alert('Listing published', 'Your equipment is now visible to farmers.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable accessibilityLabel="Add equipment listing">
      <EquipmentForm submitLabel="Publish Listing" onSubmit={handleSubmit} loading={loading} />
    </ScreenContainer>
  );
}
