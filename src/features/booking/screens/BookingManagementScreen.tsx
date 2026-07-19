/**
 * @file        BookingManagementScreen.tsx
 * @feature     Booking
 * @description Owner dashboard to filter, confirm, or reject incoming rental requests.
 * @navigation  BookingStack > Management
 * @data        bookingHistory
 * @consumes    BookingCard, confirmBooking, rejectBooking, fetchBookings
 * @author      MiStarStudio
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button, EmptyState, LoadingSpinner, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import { BookingCard } from '../components';
import {
  confirmBooking,
  fetchBookings,
  rejectBooking,
} from '../slices/bookingSlice';
import { BookingStatus } from '../types/booking.types';
import type { Booking } from '../types/booking.types';
import { Inbox } from 'lucide-react-native';

type Props = NativeStackScreenProps<BookingStackParamList, 'Management'>;
type FilterTab = 'all' | BookingStatus.PENDING | BookingStatus.CONFIRMED | BookingStatus.REJECTED;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: BookingStatus.PENDING, label: 'Pending' },
  { key: BookingStatus.CONFIRMED, label: 'Confirmed' },
  { key: BookingStatus.REJECTED, label: 'Rejected' },
];

/** Owner inbox with inline confirm/reject actions on pending rows. */
export function BookingManagementScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { bookingHistory, isLoading } = useAppSelector((state) => state.booking);
  const user = useAppSelector((state) => state.auth.user);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadBookings = useCallback(() => {
    void dispatch(fetchBookings({ role: 'OWNER', userId: user?.id }));
  }, [dispatch, user?.id]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filtered = useMemo(() => {
    if (filter === 'all') return bookingHistory;
    return bookingHistory.filter((b) => b.status === filter);
  }, [bookingHistory, filter]);

  const handleConfirm = (bookingId: string) => {
    void dispatch(confirmBooking(bookingId));
  };

  const handleReject = () => {
    if (!rejectModal || !rejectReason.trim()) return;
    void dispatch(
      rejectBooking({ bookingId: rejectModal.id, reason: rejectReason.trim() }),
    );
    setRejectModal(null);
    setRejectReason('');
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View className="mb-4">
      <BookingCard
        booking={item}
        showFarmer
        onPress={() => navigation.navigate('Detail', { bookingId: item.id })}
      />
      {item.status === BookingStatus.PENDING ? (
        <View className="mt-2 flex-row gap-2">
          <View className="flex-1">
            <Button
              label="Confirm"
              onPress={() => handleConfirm(item.id)}
              fullWidth
            />
          </View>
          <View className="flex-1">
            <Button
              label="Reject"
              variant="danger"
              onPress={() => setRejectModal({ id: item.id })}
              fullWidth
            />
          </View>
        </View>
      ) : null}
    </View>
  );

  return (
    <ScreenContainer className="px-0">
      {/* ─── Header & status filters ─── */}
      <View className="px-4 pb-2 pt-2">
        <Text className="text-2xl font-bold text-text-primary">Booking requests</Text>
        <Text className="mt-1 text-sm text-text-secondary">
          Manage incoming rental requests for your equipment
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerClassName="pr-4"
        >
          {TABS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              className={`mr-2 rounded-full px-4 py-2 ${
                filter === item.key ? 'bg-primary' : 'border border-gray-200 bg-surface'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === item.key ? 'text-white' : 'text-text-secondary'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ─── Request list ─── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6 grow"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadBookings} tintColor="#1A6B3A" />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingSpinner label="Loading requests..." />
          ) : (
            <EmptyState
              icon={<Inbox size={32} color="#9CA3AF" />}
              title="No booking requests"
              subtitle="New requests from farmers will appear here"
            />
          )
        }
        renderItem={renderItem}
      />

      {/* ─── Reject reason modal ─── */}
      <Modal visible={!!rejectModal} transparent animationType="fade">
        <View className="flex-1 justify-center bg-black/40 px-6">
          <View className="rounded-2xl bg-surface p-5">
            <Text className="text-lg font-semibold text-text-primary">Reject booking</Text>
            <Text className="mt-2 text-sm text-text-secondary">
              Please provide a reason for the farmer
            </Text>
            <TextInput
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              placeholder="Equipment unavailable for these dates..."
              placeholderTextColor="#9CA3AF"
              className="mt-4 min-h-[80px] rounded-xl border border-gray-300 px-3 py-3 text-base text-text-primary"
            />
            <View className="mt-4 flex-row gap-2">
              <View className="flex-1">
                <Button
                  label="Cancel"
                  variant="ghost"
                  onPress={() => {
                    setRejectModal(null);
                    setRejectReason('');
                  }}
                  fullWidth
                />
              </View>
              <View className="flex-1">
                <Button
                  label="Reject"
                  variant="danger"
                  onPress={handleReject}
                  disabled={!rejectReason.trim()}
                  fullWidth
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
