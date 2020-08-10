import type { RefAttributes } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { TapGestureHandler } from 'react-native-gesture-handler';

export type BottomSheetContentWrapperProps = {
  children: React.ReactNode;
  initialMaxDeltaY: number;
  style: StyleProp<ViewStyle>;
  onHandlerStateChange: (...args: any[]) => void;
  onGestureEvent: (...args: any[]) => void;
};

export type BottomSheetContentWrapper = React.ForwardRefExoticComponent<
  BottomSheetContentWrapperProps & RefAttributes<TapGestureHandler>
>;
