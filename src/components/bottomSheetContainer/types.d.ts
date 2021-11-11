import type { ReactNode } from 'react';
import type { Insets } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet/types';

export interface BottomSheetContainerProps
  extends Partial<
    Pick<
      BottomSheetProps,
      'topInset' | 'bottomInset' | 'detached' | 'elevation'
    >
  > {
  containerHeight: Animated.SharedValue<number>;
  containerOffset: Animated.SharedValue<Insets>;
  shouldCalculateHeight?: boolean;
  children: ReactNode;
}
