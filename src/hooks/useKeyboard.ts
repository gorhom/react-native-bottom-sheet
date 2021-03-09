import { useCallback, useEffect } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  KeyboardEventName,
  Platform,
} from 'react-native';
import Animated, {
  runOnUI,
  useSharedValue,
  useWorkletCallback,
} from 'react-native-reanimated';
import {
  KEYBOARD_STATE,
  KEYBOARD_DEFAULT_ANIMATION_CONFIGS,
} from '../constants';

const KEYBOARD_EVENT_MAPPER = {
  KEYBOARD_SHOW: Platform.select({
    ios: 'keyboardWillShow',
    android: 'keyboardDidShow',
    default: '',
  }) as KeyboardEventName,
  KEYBOARD_HIDE: Platform.select({
    ios: 'keyboardWillHide',
    android: 'keyboardDidHide',
    default: '',
  }) as KeyboardEventName,
};

export const useKeyboard = () => {
  //#region variables
  const shouldHandleKeyboardEvents = useSharedValue(false);
  const keyboardState = useSharedValue<KEYBOARD_STATE>(
    KEYBOARD_STATE.UNDETERMINED
  );
  const keyboardHeight = useSharedValue(0);
  const keyboardAnimationConfigs = useSharedValue<
    Animated.WithTimingConfig | Animated.WithSpringConfig
  >(KEYBOARD_DEFAULT_ANIMATION_CONFIGS);
  //#endregion

  //#region worklets
  const handleKeyboardEvent = useWorkletCallback(
    (state, height, duration, easing) => {
      if (state === KEYBOARD_STATE.SHOWN && !shouldHandleKeyboardEvents.value) {
        return;
      }
      keyboardState.value = state;
      keyboardHeight.value =
        state === KEYBOARD_STATE.SHOWN
          ? height
          : height === 0
          ? keyboardHeight.value
          : height;

      if (easing === 'keyboard') {
        return;
      }
      keyboardAnimationConfigs.value = {
        duration: duration,
        easing: easing,
      };
    }
  );
  //#endregion

  //#region callbacks
  const handleOnKeyboardShow = useCallback(
    (event: KeyboardEvent) => {
      runOnUI(handleKeyboardEvent)(
        KEYBOARD_STATE.SHOWN,
        event.endCoordinates.height,
        event.duration,
        event.easing
      );
    },
    [handleKeyboardEvent]
  );

  const handleOnKeyboardHide = useCallback(
    (event: KeyboardEvent) => {
      runOnUI(handleKeyboardEvent)(
        KEYBOARD_STATE.HIDDEN,
        event.endCoordinates.height,
        event.duration,
        event.easing
      );
    },
    [handleKeyboardEvent]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    Keyboard.addListener(
      KEYBOARD_EVENT_MAPPER.KEYBOARD_SHOW,
      handleOnKeyboardShow
    );

    return () => {
      Keyboard.removeListener(
        KEYBOARD_EVENT_MAPPER.KEYBOARD_SHOW,
        handleOnKeyboardShow
      );
    };
  }, [handleOnKeyboardShow]);

  useEffect(() => {
    Keyboard.addListener(
      KEYBOARD_EVENT_MAPPER.KEYBOARD_HIDE,
      handleOnKeyboardHide
    );

    return () => {
      Keyboard.removeListener(
        KEYBOARD_EVENT_MAPPER.KEYBOARD_HIDE,
        handleOnKeyboardHide
      );
    };
  }, [handleOnKeyboardHide]);
  //#endregion

  return {
    state: keyboardState,
    height: keyboardHeight,
    animationConfigs: keyboardAnimationConfigs,
    shouldHandleKeyboardEvents,
  };
};
