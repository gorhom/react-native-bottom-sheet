import Animated, { useAnimatedGestureHandler } from 'react-native-reanimated';
import {
  State,
  PanGestureHandlerGestureEvent,
  GestureEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { GESTURE_SOURCE, KEYBOARD_STATE } from '../constants';

export type GestureEventType = GestureEventPayload &
  PanGestureHandlerEventPayload;

export type GestureEventContextType = {
  initialPosition: number;
  initialKeyboardState: KEYBOARD_STATE;
  isScrollablePositionLocked: boolean;
};

export type GestureCallbackType = (
  type: GESTURE_SOURCE,
  payload: GestureEventType,
  context: GestureEventContextType
) => void;

export const useInteractivePanGestureHandler = (
  type: GESTURE_SOURCE,
  gestureState: Animated.SharedValue<State>,
  onStart: GestureCallbackType,
  onActive: GestureCallbackType,
  onEnd: GestureCallbackType
): ((event: PanGestureHandlerGestureEvent) => void) => {
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureEventContextType
  >({
    onStart: (payload, context) => {
      gestureState.value = payload.state;
      onStart(type, payload, context);
    },
    onActive: (payload, context) => {
      gestureState.value = payload.state;
      onActive(type, payload, context);
    },
    onEnd: (payload, context) => {
      gestureState.value = payload.state;
      onEnd(type, payload, context);
    },
    onCancel: ({ state }) => {
      gestureState.value = state;
    },
    onFail: ({ state }) => {
      gestureState.value = state;
    },
    onFinish: ({ state }) => {
      gestureState.value = state;
    },
  });

  return gestureHandler;
};
