import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet/types';
import type { Insets } from '../../types';

export interface BottomSheetContainerProps
  extends Partial<
    Pick<BottomSheetProps, 'topInset' | 'bottomInset' | 'detached'>
  > {
  containerHeight: Animated.SharedValue<number>;
  containerOffset: Animated.SharedValue<Insets>;
  shouldCalculateHeight?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}
