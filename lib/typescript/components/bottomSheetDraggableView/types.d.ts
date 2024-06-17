import type { ReactNode } from 'react';
import type { ViewProps as RNViewProps } from 'react-native';
import type { GestureRef } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

export type BottomSheetDraggableViewProps = RNViewProps & {
  nativeGestureRef?: Exclude<GestureRef, number>;
  refreshControlGestureRef?: Exclude<GestureRef, number>;
  children: ReactNode[] | ReactNode;
};
