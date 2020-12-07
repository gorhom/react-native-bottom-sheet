import type { ViewProps as RNViewProps } from 'react-native';
import type { NativeViewGestureHandler } from 'react-native-gesture-handler';
import type { GESTURE } from '../../constants';

export type BottomSheetDraggableViewProps = RNViewProps & {
  children: React.ReactNode[] | React.ReactNode;
  gestureType?: keyof typeof GESTURE;
  nativeGestureRef?: Ref<NativeViewGestureHandler> | null;
};
