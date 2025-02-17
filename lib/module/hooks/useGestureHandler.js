"use strict";

import { State } from 'react-native-gesture-handler';
import { useWorkletCallback } from 'react-native-reanimated';
import { GESTURE_SOURCE } from '../constants';
export const useGestureHandler = (source, state, gestureSource, onStart, onChange, onEnd, onFinalize) => {
  const handleOnStart = useWorkletCallback(event => {
    state.value = State.BEGAN;
    gestureSource.value = source;
    onStart(source, event);
    return;
  }, [state, gestureSource, source, onStart]);
  const handleOnChange = useWorkletCallback(event => {
    if (gestureSource.value !== source) {
      return;
    }
    state.value = event.state;
    onChange(source, event);
  }, [state, gestureSource, source, onChange]);
  const handleOnEnd = useWorkletCallback(event => {
    if (gestureSource.value !== source) {
      return;
    }
    state.value = event.state;
    gestureSource.value = GESTURE_SOURCE.UNDETERMINED;
    onEnd(source, event);
  }, [state, gestureSource, source, onEnd]);
  const handleOnFinalize = useWorkletCallback(event => {
    if (gestureSource.value !== source) {
      return;
    }
    state.value = event.state;
    gestureSource.value = GESTURE_SOURCE.UNDETERMINED;
    onFinalize(source, event);
  }, [state, gestureSource, source, onFinalize]);
  return {
    handleOnStart,
    handleOnChange,
    handleOnEnd,
    handleOnFinalize
  };
};
//# sourceMappingURL=useGestureHandler.js.map