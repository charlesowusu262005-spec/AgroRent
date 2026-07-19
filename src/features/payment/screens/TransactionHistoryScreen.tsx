/**
 * @file        TransactionHistoryScreen.tsx
 * @feature     Payment
 * @description Filterable list of all MoMo transactions with navigation to receipts.
 * @navigation  BookingStack > TransactionHistory
 * @data        transactionHistory
 * @consumes    TransactionCard, fetchTransactions
 * @author      MiStarStudio
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Receipt } from 'lucide-react-native';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EmptyState, LoadingSpinner, ScreenContainer } from '../../../components';
import type { BookingStackParamList } from '../../../navigation/types';
import { TransactionCard } from '../components';
import { fetchTransactions } from '../slices/paymentSlice';
import { PaymentStatus } from '../types/payment.types';

type Props = NativeStackScreenProps<BookingStackParamList, 'TransactionHistory'>;
type FilterTab = 'ALL' | PaymentStatus;

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: PaymentStatus.SUCCESS, label: 'Success' },
  { key: PaymentStatus.PENDING, label: 'Pending' },
  { key: PaymentStatus.FAILED, label: 'Failed' },
  { key: PaymentStatus.REVERSED, label: 'Reversed' },
];

/** Farmer payment history — status chips filter client-side until API query params exist. */
export function TransactionHistoryScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { transactionHistory, isLoading } = useAppSelector((state) => state.payment);
  const [filter, setFilter] = useState<FilterTab>('ALL');

  const load = useCallback(() => {
    void dispatch(fetchTransactions(filter === 'ALL' ? undefined : filter));
  }, [dispatch, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return transactionHistory;
    return transactionHistory.filter((p) => p.status === filter);
  }, [filter, transactionHistory]);

  return (
    <ScreenContainer className="px-0">
      {/* ─── Header & status filters ─── */}
      <View className="px-4 pb-2 pt-2">
        <Text className="text-2xl font-bold text-text-primary">Transactions</Text>
        <Text className="mt-1 text-sm text-text-secondary">Your Mobile Money payment history</Text>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              className={`rounded-full px-3 py-2 ${
                filter === item.key ? 'bg-primary' : 'border border-gray-200 bg-surface'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  filter === item.key ? 'text-white' : 'text-text-secondary'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ─── Transaction list ─── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-6 grow"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={load} tintColor="#1A6B3A" />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingSpinner label="Loading transactions..." />
          ) : (
            <EmptyState
              icon={<Receipt size={32} color="#9CA3AF" />}
              title="No transactions"
              subtitle="Your payment history will appear here"
            />
          )
        }
        renderItem={({ item }) => (
          <View className="mb-3">
            <TransactionCard
              payment={item}
              onPress={() => navigation.navigate('Receipt', { paymentId: item.id })}
            />
          </View>
        )}
      />
    </ScreenContainer>
  );
}
