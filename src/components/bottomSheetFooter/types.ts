import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet/types';

export interface BottomSheetFooterProps {
  animatedFooterPosition: SharedValue<number>;
}

export interface BottomSheetDefaultFooterProps extends BottomSheetFooterProps {
  bottomInset?: number;
  style?: ViewStyle;
  children?: ReactNode | ReactNode[];
}

export interface BottomSheetFooterContainerProps
  extends Required<Pick<BottomSheetProps, 'footerComponent'>> {}
