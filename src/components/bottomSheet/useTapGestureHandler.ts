import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

export const useTapGestureHandler = (): [
  Animated.SharedValue<State>,
  (event: PanGestureHandlerGestureEvent) => void
] => {
  const gestureState = useSharedValue<State>(State.UNDETERMINED);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: ({ state }) => {
      gestureState.value = state;
    },
    onActive: ({ state }) => {
      gestureState.value = state;
    },
    onEnd: ({ state }) => {
      gestureState.value = state;
    },
  });

  return [gestureState, gestureHandler];
};
