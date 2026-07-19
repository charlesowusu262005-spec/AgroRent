/**
 * @file        RoleSelector.tsx
 * @feature     Auth
 * @description Radio-style role cards for registration step 1 — Farmer, Owner, or Worker determines app experience.
 * @data        UserRole from auth.types; persisted via POST /auth/register
 * @consumes    auth.types, lucide-react-native
 * @author      MiStarStudio
 */

import { Pressable, Text, View } from 'react-native';
import { HardHat, Sprout, Tractor } from 'lucide-react-native';
import type { ReactNode } from 'react';

import type { UserRole } from '../types/auth.types';

/** Props for the three-way role selection on RegisterScreen step 1. */
export interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: ReactNode;
}

/** Static role definitions — copy reflects each persona's primary use case in AgroRent Ghana. */
const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'FARMER',
    title: 'Farmer',
    description: 'Rent equipment and hire skilled farm workers',
    icon: <Sprout size={28} color="#1A6B3A" />,
  },
  {
    role: 'OWNER',
    title: 'Equipment Owner',
    description: 'List your tractors and tools for rent',
    icon: <Tractor size={28} color="#00796B" />,
  },
  {
    role: 'WORKER',
    title: 'Worker',
    description: 'Find agricultural jobs and earn income',
    icon: <HardHat size={28} color="#F9A825" />,
  },
];

/** Renders selectable role cards; only one role may be active before continuing registration. */
export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  return (
    <View className="gap-3">
      {ROLE_OPTIONS.map((option) => {
        const isSelected = selectedRole === option.role;

        return (
          <Pressable
            key={option.role}
            onPress={() => onSelect(option.role)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.title}. ${option.description}`}
            className={`rounded-2xl border-2 bg-surface p-4 ${
              isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center">
              <View
                className={`mr-4 rounded-full p-3 ${
                  isSelected ? 'bg-primary/10' : 'bg-gray-100'
                }`}
              >
                {option.icon}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-text-primary">
                  {option.title}
                </Text>
                <Text className="mt-1 text-sm text-text-secondary">
                  {option.description}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
