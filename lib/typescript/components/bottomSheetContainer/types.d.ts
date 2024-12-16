import type { ReactNode } from 'react';
import type { Insets, StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet/types';

export interface BottomSheetContainerProps
  extends Partial<
    Pick<BottomSheetProps, 'topInset' | 'bottomInset' | 'detached'>
  > {
  containerHeight: SharedValue<number>;
  containerOffset: SharedValue<Required<Insets>>;
  shouldCalculateHeight?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}
