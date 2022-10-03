import Animated, { useWorkletCallback } from 'react-native-reanimated';
import {
  State,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { GESTURE_SOURCE } from '../constants';
import type {
  GestureEventHandlerCallbackType,
  GestureHandlersHookType,
} from '../types';

export const useGestureHandler: GestureHandlersHookType = (
  source: GESTURE_SOURCE,
  state: Animated.SharedValue<State>,
  gestureSource: Animated.SharedValue<GESTURE_SOURCE>,
  onStart: GestureEventHandlerCallbackType,
  onChange: GestureEventHandlerCallbackType,
  onEnd: GestureEventHandlerCallbackType,
  onFinalize: GestureEventHandlerCallbackType
) => {
  const handleOnStart = useWorkletCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      state.value = State.BEGAN;
      gestureSource.value = source;

      onStart(source, event);
      return;
    },
    [state, gestureSource, source, onStart]
  );

  const handleOnChange = useWorkletCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (gestureSource.value !== source) {
        return;
      }

      state.value = event.state;
      onChange(source, event);
    },
    [state, gestureSource, source, onChange]
  );

  const handleOnEnd = useWorkletCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (gestureSource.value !== source) {
        return;
      }

      state.value = event.state;
      gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

      onEnd(source, event);
    },
    [state, gestureSource, source, onEnd]
  );

  const handleOnFinalize = useWorkletCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (gestureSource.value !== source) {
        return;
      }

      state.value = event.state;
      gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

      onFinalize(source, event);
    },
    [state, gestureSource, source, onFinalize]
  );

  return {
    handleOnStart,
    handleOnChange,
    handleOnEnd,
    handleOnFinalize,
  };
};
