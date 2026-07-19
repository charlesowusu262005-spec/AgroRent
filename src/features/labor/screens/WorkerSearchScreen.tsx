/**
 * @file        WorkerSearchScreen.tsx
 * @feature     Labor
 * @description Farmer hub to search, filter, and sort available farm workers by skill and distance.
 * @navigation  LaborStack > Hub
 * @data        workerSearchResults, filters, searchQuery, userLocation
 * @consumes    WorkerCard, fetchWorkers, FARM_SKILLS
 * @author      MiStarStudio
 */

import { useCallback, useEffect, useState } from 'react';
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
import { Search } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EmptyState, LoadingSpinner, ScreenContainer } from '../../../components';
import type { LaborStackParamList } from '../../../navigation/types';
import { WorkerCard } from '../components';
import { FARM_SKILLS } from '../constants/skills';
import { fetchWorkers, setFilters, setSearchQuery } from '../slices/laborSlice';
import type { WorkerSortBy } from '../types/labor.types';

type Props = NativeStackScreenProps<LaborStackParamList, 'Hub'>;

const SORT_OPTIONS: { key: WorkerSortBy; label: string }[] = [
  { key: 'rating', label: 'Top rated' },
  { key: 'distance', label: 'Nearest' },
  { key: 'rate_asc', label: 'Lowest rate' },
  { key: 'rate_desc', label: 'Highest rate' },
];

/** Main labor discovery screen — debounced search syncs query to Redux before refetch. */
export function WorkerSearchScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { workerSearchResults, filters, isLoading, searchQuery, userLocation } =
    useAppSelector((state) => state.labor);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const load = useCallback(() => {
    void dispatch(
      fetchWorkers({
        query: searchQuery,
        filters,
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      }),
    );
  }, [dispatch, filters, searchQuery, userLocation]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce avoids firing fetchWorkers on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => dispatch(setSearchQuery(localQuery)), 400);
    return () => clearTimeout(timer);
  }, [dispatch, localQuery]);

  return (
    <ScreenContainer className="px-0">
      {/* ─── Search & skill filters ─── */}
      <View className="px-4 pb-2 pt-2">
        <Text className="text-2xl font-bold text-text-primary">Find Workers</Text>
        <View className="mt-4 flex-row items-center rounded-xl border border-gray-200 bg-surface px-3">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={localQuery}
            onChangeText={setLocalQuery}
            placeholder="Search skills, names, regions..."
            placeholderTextColor="#9CA3AF"
            className="ml-2 flex-1 py-3 text-base text-text-primary"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          <Pressable
            onPress={() => dispatch(setFilters({ skill: null }))}
            className={`mr-2 rounded-full px-4 py-2 ${
              !filters.skill ? 'bg-primary' : 'border border-gray-200 bg-surface'
            }`}
          >
            <Text className={`text-sm font-medium ${!filters.skill ? 'text-white' : 'text-text-secondary'}`}>
              All skills
            </Text>
          </Pressable>
          {FARM_SKILLS.map((skill) => (
            <Pressable
              key={skill}
              onPress={() => dispatch(setFilters({ skill }))}
              className={`mr-2 rounded-full px-4 py-2 ${
                filters.skill === skill ? 'bg-primary' : 'border border-gray-200 bg-surface'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filters.skill === skill ? 'text-white' : 'text-text-secondary'
                }`}
              >
                {skill}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => dispatch(setFilters({ sortBy: option.key }))}
              className={`mr-2 rounded-full px-3 py-1.5 ${
                filters.sortBy === option.key ? 'bg-secondary/10' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  filters.sortBy === option.key ? 'text-secondary' : 'text-text-muted'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ─── Worker results ─── */}
      <FlatList
        data={workerSearchResults}
        keyExtractor={(item) => item.userId}
        contentContainerClassName="px-4 pb-6 grow"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={load} tintColor="#1A6B3A" />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingSpinner label="Finding workers..." />
          ) : (
            <EmptyState
              icon={<Search size={32} color="#9CA3AF" />}
              title="No workers found"
              subtitle="Try a different skill or expand your search"
            />
          )
        }
        renderItem={({ item }) => (
          <View className="mb-3">
            <WorkerCard
              worker={item}
              userLocation={userLocation}
              onPress={() => navigation.navigate('WorkerDetail', { workerId: item.userId })}
            />
          </View>
        )}
      />
    </ScreenContainer>
  );
}
