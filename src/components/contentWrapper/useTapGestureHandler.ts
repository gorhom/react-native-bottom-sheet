import Animated, { useAnimatedGestureHandler } from 'react-native-reanimated';
import {
  State,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

export const useTapGestureHandler = (
  gestureState: Animated.SharedValue<State>
) => {
  const handleGestureEvent = useAnimatedGestureHandler({
    onStart: ({ state }) => {
      gestureState.value = state;
    },
    onActive: ({ state }) => {
      gestureState.value = state;
    },
    onCancel: ({ state }) => {
      gestureState.value = state;
    },
    onEnd: ({ state }) => {
      gestureState.value = state;
    },
    onFail: ({ state }) => {
      gestureState.value = state;
    },
    onFinish: ({ state }) => {
      gestureState.value = state;
    },
  });

  return handleGestureEvent as (event: TapGestureHandlerGestureEvent) => void;
};
