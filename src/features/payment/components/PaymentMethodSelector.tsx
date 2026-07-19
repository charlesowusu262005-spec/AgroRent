/**
 * @file        PaymentMethodSelector.tsx
 * @feature     Payment
 * @description Radio-style selector for MTN, Vodafone, and AirtelTigo MoMo providers.
 * @data        PaymentProvider, PROVIDER_LABELS, PROVIDER_COLORS
 * @author      MiStarStudio
 */

import { Pressable, Text, View } from 'react-native';
import { Smartphone } from 'lucide-react-native';

import { PROVIDER_COLORS, PROVIDER_LABELS } from '../data/mockPaymentData';
import { PaymentProvider } from '../types/payment.types';

/** Props for the three-provider MoMo method picker on the payment screen. */
export interface PaymentMethodSelectorProps {
  selected: PaymentProvider;
  onSelect: (provider: PaymentProvider) => void;
}

const PROVIDERS = [
  PaymentProvider.MTN_MOMO,
  PaymentProvider.VODAFONE_CASH,
  PaymentProvider.AIRTELTIGO,
];

/** Branded provider cards — color coding helps farmers pick the network matching their wallet. */
export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <View className="gap-3">
      {PROVIDERS.map((provider) => {
        const colors = PROVIDER_COLORS[provider];
        const isSelected = selected === provider;

        return (
          <Pressable
            key={provider}
            onPress={() => onSelect(provider)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={PROVIDER_LABELS[provider]}
            className={`overflow-hidden rounded-2xl border-2 ${
              isSelected ? 'border-primary' : 'border-transparent'
            }`}
          >
            <View
              className="flex-row items-center px-4 py-5"
              style={{ backgroundColor: colors.bg }}
            >
              <View
                className="mr-4 rounded-full p-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <Smartphone size={24} color={colors.text} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.text }}>
                  {PROVIDER_LABELS[provider]}
                </Text>
                <Text className="mt-0.5 text-sm opacity-80" style={{ color: colors.text }}>
                  Pay with Mobile Money
                </Text>
              </View>
              {isSelected ? (
                <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Text className="text-xs font-bold text-white">✓</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
