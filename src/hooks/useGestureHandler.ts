import Animated, { useAnimatedGestureHandler } from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { GESTURE_SOURCE } from '../constants';
import type { GestureEventHandlerCallbackType } from '../types';

export const useGestureHandler = (
  type: GESTURE_SOURCE,
  state: Animated.SharedValue<State>,
  handleOnStart: GestureEventHandlerCallbackType,
  handleOnActive: GestureEventHandlerCallbackType,
  handleOnEnd: GestureEventHandlerCallbackType
): ((event: PanGestureHandlerGestureEvent) => void) => {
  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
      {
        onStart: (payload, context) => {
          state.value = payload.state;
          handleOnStart(type, payload, context);
        },
        onActive: (payload, context) => {
          state.value = payload.state;
          handleOnActive(type, payload, context);
        },
        onEnd: (payload, context) => {
          state.value = payload.state;
          handleOnEnd(type, payload, context);
        },
        onCancel: payload => {
          state.value = payload.state;
        },
        onFail: payload => {
          state.value = payload.state;
        },
        onFinish: payload => {
          state.value = payload.state;
        },
      },
      [type, state, handleOnStart, handleOnActive, handleOnEnd]
    );
  return gestureHandler;
};
