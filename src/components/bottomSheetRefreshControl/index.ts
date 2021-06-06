import type React from 'react';
import type { RefreshControlProps } from 'react-native';
import type { NativeViewGestureHandlerProps } from 'react-native-gesture-handler';
import BottomSheetRefreshControl from './BottomSheetRefreshControl';

export default BottomSheetRefreshControl as any as React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    RefreshControlProps & {
      children: React.ReactNode | React.ReactNode[];
    } & React.RefAttributes<
        React.ComponentType<
          NativeViewGestureHandlerProps & React.RefAttributes<any>
        >
      >
  >
>;
