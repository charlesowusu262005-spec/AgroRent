/**
 * @file        EquipmentSearchScreen.tsx
 * @feature     Equipment
 * @description Farmer search hub — text query, category chips, filters, compare, and list view.
 * @navigation  EquipmentStack > Search (initialRoute)
 * @data        Redux equipment.searchResults, filters, compareIds, userLocation
 * @consumes    fetchEquipment, EquipmentCard, FilterPanel, CategoryChip
 * @author      MiStarStudio
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { Filter, GitCompare, List, Map as MapIcon, Search } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EmptyState, LoadingSpinner, ScreenContainer } from '../../../components';
import type { EquipmentStackParamList } from '../../../navigation/types';
import { EquipmentCategory } from '../types/equipment.types';
import {
  CategoryChip,
  EquipmentCard,
  EQUIPMENT_CARD_HEIGHT,
  FilterPanel,
} from '../components';
import { CATEGORY_LABELS } from '../constants/categories';
import {
  fetchEquipment,
  resetFilters,
  setFilters,
  setSearchQuery,
  setUserLocation,
  toggleCompareId,
} from '../slices/equipmentSlice';

type Props = NativeStackScreenProps<EquipmentStackParamList, 'Search'>;

/** Primary equipment discovery screen for farmers. */
export function EquipmentSearchScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const {
    searchResults,
    filters,
    isLoading,
    searchQuery,
    compareIds,
    userLocation,
  } = useAppSelector((state) => state.equipment);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [filterOpen, setFilterOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [activeChip, setActiveChip] = useState<EquipmentCategory | 'ALL'>('ALL');

  const loadEquipment = useCallback(
    (force = false) => {
      void dispatch(
        fetchEquipment({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          filters,
          query: searchQuery,
          force,
        }),
      );
    },
    [dispatch, filters, searchQuery, userLocation],
  );

  // ─── Location & data loading ─────────────────────────────────────────────────

  useEffect(() => {
    void Location.requestForegroundPermissionsAsync().then(async ({ status }) => {
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({});
        dispatch(
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
      }
    });
  }, [dispatch]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  useEffect(() => {
    // WHY: debounce avoids dispatching fetch on every keystroke
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, localQuery]);

  const handleChipPress = (category: EquipmentCategory | 'ALL') => {
    setActiveChip(category);
    dispatch(
      setFilters({
        category: category === 'ALL' ? [] : [category],
      }),
    );
  };

  // ─── Header (search, chips, list/map toggle, compare) ────────────────────────

  const header = (
    <View className="pt-2">
      <Text className="text-2xl font-bold text-text-primary">Find Equipment</Text>
      <View className="mt-4 flex-row items-center rounded-xl border border-gray-200 bg-surface px-3">
        <Search size={18} color="#9CA3AF" />
        <TextInput
          value={localQuery}
          onChangeText={setLocalQuery}
          placeholder="Search tractors, sprayers, location..."
          placeholderTextColor="#9CA3AF"
          className="ml-2 flex-1 py-3 text-base text-text-primary"
          accessibilityLabel="Search equipment"
        />
        <Pressable
          onPress={() => setFilterOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          className="p-2"
        >
          <Filter size={20} color="#1A6B3A" />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerClassName="pr-4"
      >
        <CategoryChip
          label="All"
          selected={activeChip === 'ALL'}
          onPress={() => handleChipPress('ALL')}
        />
        {Object.values(EquipmentCategory).map((category) => (
          <CategoryChip
            key={category}
            label={CATEGORY_LABELS[category]}
            selected={activeChip === category}
            onPress={() => handleChipPress(category)}
          />
        ))}
      </ScrollView>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row rounded-xl bg-gray-100 p-1">
          <Pressable
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityState={{ selected: true }}
            className="flex-row items-center rounded-lg bg-surface px-3 py-2"
          >
            <List size={16} color="#1A6B3A" />
            <Text className="ml-1 text-sm font-semibold text-primary">List</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Map')}
            accessibilityRole="button"
            className="flex-row items-center rounded-lg px-3 py-2"
          >
            <MapIcon size={16} color="#6B7280" />
            <Text className="ml-1 text-sm font-medium text-text-secondary">Map</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setCompareMode((prev) => !prev)}
          accessibilityRole="button"
          className={`flex-row items-center rounded-xl px-3 py-2 ${
            compareMode ? 'bg-primary/10' : 'bg-gray-100'
          }`}
        >
          <GitCompare size={16} color="#1A6B3A" />
          <Text className="ml-1 text-sm font-semibold text-primary">
            Compare {compareIds.length > 0 ? `(${compareIds.length})` : ''}
          </Text>
        </Pressable>
      </View>

      {compareMode && compareIds.length >= 2 ? (
        <Pressable
          onPress={() => navigation.navigate('Compare', { equipmentIds: compareIds })}
          className="mt-3 rounded-xl bg-primary py-3"
          accessibilityRole="button"
        >
          <Text className="text-center text-sm font-semibold text-white">
            Compare selected ({compareIds.length})
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  const listEmpty = useMemo(() => {
    if (isLoading) return <LoadingSpinner label="Finding equipment near you..." />;
    return (
      <EmptyState
        icon={<Search size={32} color="#9CA3AF" />}
        title="No equipment found"
        subtitle="Try adjusting your filters or expanding your search radius"
        actionLabel="Clear filters"
        onAction={() => dispatch(resetFilters())}
      />
    );
  }, [dispatch, isLoading]);

  return (
    <ScreenContainer header={header} className="px-0">
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-24 pt-2 grow"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => loadEquipment(true)}
            tintColor="#1A6B3A"
          />
        }
        getItemLayout={(_, index) => ({
          length: EQUIPMENT_CARD_HEIGHT,
          offset: EQUIPMENT_CARD_HEIGHT * index,
          index,
        })}
        ListEmptyComponent={listEmpty}
        renderItem={({ item }) => (
          <EquipmentCard
            equipment={item}
            userLocation={userLocation}
            compareMode={compareMode}
            isSelectedForCompare={compareIds.includes(item.id)}
            onToggleCompare={() => dispatch(toggleCompareId(item.id))}
            onPress={() => navigation.navigate('Detail', { equipmentId: item.id })}
          />
        )}
      />

      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(next) => dispatch(setFilters(next))}
        onClear={() => dispatch(resetFilters())}
      />
    </ScreenContainer>
  );
}
