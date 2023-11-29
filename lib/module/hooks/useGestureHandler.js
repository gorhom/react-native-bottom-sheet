import { useAnimatedGestureHandler } from 'react-native-reanimated';
import { State } from 'react-native-gesture-handler';
import { GESTURE_SOURCE } from '../constants';

const resetContext = context => {
  'worklet';

  Object.keys(context).map(key => {
    context[key] = undefined;
  });
};

export const useGestureHandler = (type, state, gestureSource, handleOnStart, handleOnActive, handleOnEnd) => {
  const gestureHandler = useAnimatedGestureHandler({
    onActive: (payload, context) => {
      if (!context.didStart) {
        context.didStart = true;
        state.value = State.BEGAN;
        gestureSource.value = type;
        handleOnStart(type, payload, context);
        return;
      }

      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      handleOnActive(type, payload, context);
    },
    onEnd: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = GESTURE_SOURCE.UNDETERMINED;
      handleOnEnd(type, payload, context);
      resetContext(context);
    },
    onCancel: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = GESTURE_SOURCE.UNDETERMINED;
      resetContext(context);
    },
    onFail: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = GESTURE_SOURCE.UNDETERMINED;
      resetContext(context);
    },
    onFinish: (payload, context) => {
      if (gestureSource.value !== type) {
        return;
      }

      state.value = payload.state;
      gestureSource.value = GESTURE_SOURCE.UNDETERMINED;
      resetContext(context);
    }
  }, [type, state, handleOnStart, handleOnActive, handleOnEnd]);
  return gestureHandler;
};
//# sourceMappingURL=useGestureHandler.js.map