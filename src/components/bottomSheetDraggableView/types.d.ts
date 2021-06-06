import type { ViewProps as RNViewProps } from 'react-native';
import type { NativeViewGestureHandler } from 'react-native-gesture-handler';
import type { GESTURE_SOURCE } from '../../constants';

export type BottomSheetDraggableViewProps = RNViewProps & {
  children: React.ReactNode[] | React.ReactNode;
  gestureType?: GESTURE_SOURCE;
  nativeGestureRef?: Ref<NativeViewGestureHandler> | null;
  refreshControlGestureRef?: Ref<NativeViewGestureHandler> | null;
};
