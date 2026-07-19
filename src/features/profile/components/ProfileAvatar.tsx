/**
 * @file        ProfileAvatar.tsx
 * @feature     Profile
 * @description Large avatar with optional camera overlay for profile photo editing.
 * @consumes    Avatar
 * @author      MiStarStudio
 */

import { Pressable, View } from 'react-native';
import { Camera } from 'lucide-react-native';

import { Avatar } from '../../../components';

/** Props for the profile header avatar with optional edit affordance. */
export interface ProfileAvatarProps {
  name: string;
  imageUrl?: string | null;
  editable?: boolean;
  onPress?: () => void;
}

/** Wraps Avatar in a pressable when editable; shows camera badge overlay. */
export function ProfileAvatar({
  name,
  imageUrl,
  editable = false,
  onPress,
}: ProfileAvatarProps) {
  const content = (
    <View className="relative">
      <Avatar name={name} imageUrl={imageUrl} size="lg" />
      {editable ? (
        <View className="absolute bottom-0 right-0 rounded-full border-2 border-surface bg-primary p-2">
          <Camera size={16} color="#FFFFFF" />
        </View>
      ) : null}
    </View>
  );

  if (editable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Change profile photo"
        className="self-center active:opacity-90"
      >
        {content}
      </Pressable>
    );
  }

  return <View className="self-center">{content}</View>;
}
