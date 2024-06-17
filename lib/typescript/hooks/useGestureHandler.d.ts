import Animated from 'react-native-reanimated';
import { State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { GESTURE_SOURCE } from '../constants';
import type { GestureEventHandlerCallbackType } from '../types';
export declare const useGestureHandler: (type: GESTURE_SOURCE, state: Animated.SharedValue<State>, gestureSource: Animated.SharedValue<GESTURE_SOURCE>, handleOnStart: GestureEventHandlerCallbackType, handleOnActive: GestureEventHandlerCallbackType, handleOnEnd: GestureEventHandlerCallbackType) => (event: PanGestureHandlerGestureEvent) => void;
