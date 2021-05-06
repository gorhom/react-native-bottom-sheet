import type { ReactNode } from 'react';
import type Animated from 'react-native-reanimated';

export interface BottomSheetContainerProps {
  containerHeight: Animated.SharedValue<number>;
  topInset?: number;
  bottomInset?: number;
  children: ReactNode;
}
