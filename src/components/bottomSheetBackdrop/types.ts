import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type {
  BottomSheetVariables,
  NullableAccessibilityProps,
} from '../../types';

export interface BottomSheetBackdropProps
  extends Pick<ViewProps, 'style'>,
    BottomSheetVariables {}

export type BackdropPressBehavior = 'none' | 'close' | 'collapse' | number;

export interface BottomSheetDefaultBackdropProps
  extends BottomSheetBackdropProps,
    NullableAccessibilityProps {
  opacity?: number;
  appearsOnIndex?: number;
  disappearsOnIndex?: number;
  enableTouchThrough?: boolean;
  pressBehavior?: BackdropPressBehavior;
  onPress?: () => void;
  children?: ReactNode | ReactNode[];
}
