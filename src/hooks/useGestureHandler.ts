import { useCallback } from 'react';
import {
  type GestureStateChangeEvent,
  type GestureUpdateEvent,
  type PanGestureChangeEventPayload,
  type PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import { GESTURE_SOURCE } from '../constants';
import type {
  GestureEventHandlerCallbackType,
  GestureHandlersHookType,
} from '../types';

export const useGestureHandler: GestureHandlersHookType = (
  source: GESTURE_SOURCE,
  state: SharedValue<State>,
  gestureSource: SharedValue<GESTURE_SOURCE>,
  onStart: GestureEventHandlerCallbackType,
  onChange: GestureEventHandlerCallbackType,
  onEnd: GestureEventHandlerCallbackType,
  onFinalize: GestureEventHandlerCallbackType
) => {
  const handleOnStart = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      state.value = State.BEGAN;
      gestureSource.value = source;

      onStart(source, event);
      return;
    },
    [state, gestureSource, source, onStart]
  );

  const handleOnChange = useCallback(
    (
      event: GestureUpdateEvent<
        PanGestureHandlerEventPayload & PanGestureChangeEventPayload
      >
    ) => {
      'worklet';
      if (gestureSource.value !== source) {
        return;
      }

      state.value = event.state;
      onChange(source, event);
    },
    [state, gestureSource, source, onChange]
  );

  const handleOnEnd = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
      if (gestureSource.value !== source) {
        return;
      }

      state.value = event.state;
      gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

      onEnd(source, event);
    },
    [state, gestureSource, source, onEnd]
  );

  const handleOnFinalize = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';
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
