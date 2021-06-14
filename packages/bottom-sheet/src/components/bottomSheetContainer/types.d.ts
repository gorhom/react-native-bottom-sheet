import type { ReactNode } from 'react';
import type { Insets } from 'react-native';
import type Animated from 'react-native-reanimated';

export interface BottomSheetContainerProps {
  containerHeight: Animated.SharedValue<number>;
  containerOffset: Animated.SharedValue<Insets>;
  topInset?: number;
  bottomInset?: number;
  shouldCalculateHeight?: boolean;
  children: ReactNode;
}
