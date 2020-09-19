import type { RefAttributes } from 'react';
import type { TapGestureHandler, State } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';

export type BottomSheetContentWrapperProps = {
  gestureState: Animated.SharedValue<State>;
  maxDeltaY: number;
  height: number;
  children: React.ReactNode;
};

export type BottomSheetContentWrapper = React.ForwardRefExoticComponent<
  BottomSheetContentWrapperProps & RefAttributes<TapGestureHandler>
>;
