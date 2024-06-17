import type { ReactNode, Ref } from 'react';
import type { ViewProps as RNViewProps } from 'react-native';
import type { NativeViewGestureHandler } from 'react-native-gesture-handler';
import type { GESTURE_SOURCE } from '../../constants';

export type BottomSheetDraggableViewProps = RNViewProps & {
  /**
   * Defines the gesture type of the draggable view.
   *
   * @default GESTURE_SOURCE.CONTENT
   * @type GESTURE_SOURCE
   */
  gestureType?: GESTURE_SOURCE;
  nativeGestureRef?: Ref<NativeViewGestureHandler> | null;
  refreshControlGestureRef?: Ref<NativeViewGestureHandler> | null;
  children: ReactNode[] | ReactNode;
};
