/**
 * @file        CachedImage.tsx
 * @feature     Design System
 * @description Disk-cached remote image with blur placeholder for equipment and booking thumbnails.
 * @data        Remote URIs from listing/booking APIs.
 * @consumes    expo-image
 * @author      MiStarStudio
 */

import { Image } from 'expo-image';
import type { ImageStyle, StyleProp } from 'react-native';

/** Props for optimised list/detail images. */
export interface CachedImageProps {
  uri: string;
  className?: string;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

/**
 * Wraps expo-image with memory-disk cache and a neutral blurhash
 * so FlatList scroll does not flash empty rectangles on slow rural networks.
 */
export function CachedImage({ uri, className, style, accessibilityLabel }: CachedImageProps) {
  return (
    <Image
      source={{ uri }}
      className={className}
      style={style}
      contentFit="cover"
      transition={200}
      placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      cachePolicy="memory-disk"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
