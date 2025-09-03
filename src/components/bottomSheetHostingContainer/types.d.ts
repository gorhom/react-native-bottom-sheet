import type { ReactNode } from 'react';
import type { Insets, StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { ContainerLayoutState, LayoutState } from '../../types';
import type { BottomSheetProps } from '../bottomSheet/types';

export interface BottomSheetHostingContainerProps
  extends Partial<
    Pick<BottomSheetProps, 'topInset' | 'bottomInset' | 'detached'>
  > {
  containerLayoutState?: SharedValue<ContainerLayoutState>;
  layoutState?: SharedValue<LayoutState>;

  shouldCalculateHeight?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}
