import type { RefAttributes } from 'react';
import type { TapGestureHandler, State } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';

export type BottomSheetContentWrapperProps = {
  gestureState: Animated.SharedValue<State>;
  children: React.ReactNode;
};

export type BottomSheetContentWrapper = React.ForwardRefExoticComponent<
  BottomSheetContentWrapperProps & RefAttributes<TapGestureHandler>
>;
