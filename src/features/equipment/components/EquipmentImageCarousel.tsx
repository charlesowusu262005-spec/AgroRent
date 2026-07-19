/**
 * @file        EquipmentImageCarousel.tsx
 * @feature     Equipment
 * @description Full-width horizontal image pager with dot indicators for detail hero.
 * @consumes    FlatList, Dimensions
 * @author      MiStarStudio
 */

import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';

/** Props for the detail screen photo carousel. */
export interface EquipmentImageCarouselProps {
  images: string[];
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/** Swipeable gallery; shows grey placeholder when listing has no photos. */
export function EquipmentImageCarousel({
  images,
  height = 280,
}: EquipmentImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<string>>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  if (images.length === 0) {
    return <View className="bg-gray-200" style={{ height }} />;
  }

  return (
    <View>
      <FlatList
        ref={listRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(_, index) => `image-${index}`}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: SCREEN_WIDTH, height }}
            className="bg-gray-200"
            accessibilityLabel="Equipment photo"
          />
        )}
      />
      {images.length > 1 ? (
        <View className="absolute bottom-4 w-full flex-row justify-center gap-2">
          {images.map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === activeIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
