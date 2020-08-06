import type { ViewProps as RNViewProps } from 'react-native';
import type { NativeViewGestureHandler } from 'react-native-gesture-handler';

export type BottomSheetDraggableViewProps = RNViewProps & {
  children: React.ReactNode[] | React.ReactNode;
  nativeGestureRef?: Ref<NativeViewGestureHandler> | null;
};
