import type React from 'react';
import type { RefreshControlProps } from 'react-native';
import type {
  NativeViewGestureHandlerProps,
  SimultaneousGesture,
} from 'react-native-gesture-handler';
import BottomSheetRefreshControl from './BottomSheetRefreshControl';

export default BottomSheetRefreshControl as never as React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    RefreshControlProps & {
      scrollableGesture: SimultaneousGesture;
      children: React.ReactNode | React.ReactNode[];
    } & React.RefAttributes<
        React.ComponentType<
          NativeViewGestureHandlerProps & React.RefAttributes<never>
        >
      >
  >
>;
