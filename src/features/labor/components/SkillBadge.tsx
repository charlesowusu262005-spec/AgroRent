/**
 * @file        SkillBadge.tsx
 * @feature     Labor
 * @description Compact pill label for a single farm skill on worker cards and profiles.
 * @author      MiStarStudio
 */

import { Text, View } from 'react-native';

/** Props for a skill chip with default or outline styling. */
export interface SkillBadgeProps {
  skill: string;
  variant?: 'default' | 'outline';
}

/** Renders a single skill tag — outline variant used on profile detail for emphasis. */
export function SkillBadge({ skill, variant = 'default' }: SkillBadgeProps) {
  return (
    <View
      className={`mr-2 mb-2 self-start rounded-full px-2.5 py-1 ${
        variant === 'outline'
          ? 'border border-primary/30 bg-primary/5'
          : 'bg-secondary/10'
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          variant === 'outline' ? 'text-primary' : 'text-secondary'
        }`}
      >
        {skill}
      </Text>
    </View>
  );
}
