import type { RefAttributes } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { TapGestureHandler } from 'react-native-gesture-handler';

export type BottomSheetContentWrapperProps = {
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onLayout?: ViewProps['onLayout'];
  onHandlerStateChange: (...args: any[]) => void;
  onGestureEvent: (...args: any[]) => void;
};

export type BottomSheetContentWrapper = React.ForwardRefExoticComponent<
  BottomSheetContentWrapperProps & RefAttributes<TapGestureHandler>
>;
