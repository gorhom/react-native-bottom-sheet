import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { GESTURE_SOURCE } from '../constants';
import type {
  GestureEventContextType,
  GestureEventHandlerCallbackType,
} from '../types';
import { BottomSheetGestureCallbacks } from 'src/components/bottomSheetGestureHandlersProvider/types';

const resetContext = (context: any) => {
  'worklet';

  Object.keys(context).map(key => {
    context[key] = undefined;
  });
};

export const useGestureHandler = (
  type: GESTURE_SOURCE,
  state: Animated.SharedValue<State>,
  gestureSource: Animated.SharedValue<GESTURE_SOURCE>,
  handleOnStart: GestureEventHandlerCallbackType,
  handleOnActive: GestureEventHandlerCallbackType,
  handleOnEnd: GestureEventHandlerCallbackType,
  callbacks: BottomSheetGestureCallbacks
): ((event: PanGestureHandlerGestureEvent) => void) => {
  const { onDragStart = () => {}, onDragEnd = () => {} } = callbacks;

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureEventContextType
  >(
    {
      onActive: (payload, context) => {
        if (!context.didStart) {
          context.didStart = true;

          state.value = State.BEGAN;
          gestureSource.value = type;

          handleOnStart(type, payload, context);
          runOnJS(onDragStart)();
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
        runOnJS(onDragEnd)();
        resetContext(context);
      },
      onCancel: (payload, context) => {
        if (gestureSource.value !== type) {
          return;
        }

        state.value = payload.state;
        gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

        runOnJS(onDragEnd)();
        resetContext(context);
      },
      onFail: (payload, context) => {
        if (gestureSource.value !== type) {
          return;
        }

        state.value = payload.state;
        gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

        runOnJS(onDragEnd)();
        resetContext(context);
      },
      onFinish: (payload, context) => {
        if (gestureSource.value !== type) {
          return;
        }

        state.value = payload.state;
        gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

        runOnJS(onDragEnd)();
        resetContext(context);
      },
    },
    [type, state, handleOnStart, handleOnActive, handleOnEnd]
  );
  return gestureHandler;
};
