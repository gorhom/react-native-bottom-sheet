import type { RefAttributes } from 'react';
import type { TapGestureHandler, State } from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';

export interface BottomSheetContentWrapperProps {
  gestureState: Animated.SharedValue<State>;
  animatedProps: Record<string, number>;
  children: React.ReactNode;
}

export type BottomSheetContentWrapper = React.ForwardRefExoticComponent<
  BottomSheetContentWrapperProps & RefAttributes<TapGestureHandler>
>;
