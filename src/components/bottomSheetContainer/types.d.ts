import type { ReactNode } from 'react';
import type { Insets, StyleProp, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet/types';

type PartialBottomSheetProps = Partial<
  Pick<
    BottomSheetProps,
    'topInset' | 'bottomInset' | 'detached' | 'testID' | 'accessibilityLabel'
  >
>;

export interface BottomSheetContainerProps extends PartialBottomSheetProps {
  containerHeight: Animated.SharedValue<number>;
  containerOffset: Animated.SharedValue<Insets>;
  shouldCalculateHeight?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}
