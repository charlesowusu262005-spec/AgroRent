/**
 * @file        JobRequestForm.tsx
 * @feature     Labor
 * @description Controlled form for farmer hire requests — service type, date, location, amount.
 * @data        JobRequestFormValues, SERVICE_TYPES
 * @consumes    Input
 * @author      MiStarStudio
 */

import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { Input } from '../../../components';
import { SERVICE_TYPES } from '../constants/skills';

/** Field values for the hire request form on LaborRequestScreen. */
export interface JobRequestFormValues {
  serviceType: string;
  jobDate: string;
  locationName: string;
  agreedAmount: string;
  notes: string;
}

/** Props for the controlled hire request form with generic onChange handler. */
export interface JobRequestFormProps {
  values: JobRequestFormValues;
  onChange: <K extends keyof JobRequestFormValues>(
    key: K,
    value: JobRequestFormValues[K],
  ) => void;
  /** Worker's hourly rate shown as a hint next to the amount field. */
  hourlyRate?: number;
}

/** Hire request fields — service type uses a bottom-sheet picker for touch-friendly selection. */
export function JobRequestForm({ values, onChange, hourlyRate }: JobRequestFormProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <View className="gap-4">
      <View>
        <Text className="mb-1.5 text-sm font-medium text-text-primary">Service type</Text>
        <Pressable
          onPress={() => setPickerOpen(true)}
          className="flex-row items-center justify-between rounded-xl border border-gray-300 bg-surface px-3 py-3.5"
        >
          <Text className={values.serviceType ? 'text-text-primary' : 'text-text-muted'}>
            {values.serviceType || 'Select service type'}
          </Text>
          <ChevronDown size={18} color="#6B7280" />
        </Pressable>
      </View>

      <Input
        label="Job date (YYYY-MM-DD)"
        value={values.jobDate}
        onChangeText={(jobDate) => onChange('jobDate', jobDate)}
        placeholder="2026-07-15"
      />

      <Input
        label="Farm location"
        value={values.locationName}
        onChangeText={(locationName) => onChange('locationName', locationName)}
        placeholder="Ejisu, Ashanti"
      />

      <Input
        label={`Proposed amount (GHS)${hourlyRate ? ` · ~${hourlyRate}/hr` : ''}`}
        value={values.agreedAmount}
        onChangeText={(agreedAmount) => onChange('agreedAmount', agreedAmount)}
        keyboardType="numeric"
        placeholder="200"
      />

      <View>
        <Text className="mb-1.5 text-sm font-medium text-text-primary">Notes (optional)</Text>
        <TextInput
          value={values.notes}
          onChangeText={(notes) => onChange('notes', notes)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholder="Access directions, tools needed, etc."
          placeholderTextColor="#9CA3AF"
          className="min-h-[80px] rounded-xl border border-gray-300 bg-surface px-3 py-3 text-base text-text-primary"
        />
      </View>

      {/* ─── Service type picker modal ─── */}
      <Modal visible={pickerOpen} transparent animationType="slide">
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setPickerOpen(false)}>
          <Pressable className="max-h-[50%] rounded-t-3xl bg-surface" onPress={() => {}}>
            <Text className="border-b border-gray-200 py-4 text-center text-lg font-semibold text-text-primary">
              Service type
            </Text>
            <ScrollView>
              {SERVICE_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    onChange('serviceType', type);
                    setPickerOpen(false);
                  }}
                  className="border-b border-gray-100 px-4 py-4"
                >
                  <Text className="text-base text-text-primary">{type}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
