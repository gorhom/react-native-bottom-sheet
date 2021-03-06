import { useEffect } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  KeyboardEventEasing,
  KeyboardEventName,
  Platform,
} from 'react-native';
import { runOnUI, useSharedValue } from 'react-native-reanimated';
import { KEYBOARD_STATE } from '../constants';

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
  const keyboardState = useSharedValue<KEYBOARD_STATE>(
    KEYBOARD_STATE.UNDETERMINED
  );
  const keyboardHeight = useSharedValue(0);
  const keyboardAnimationEasing = useSharedValue<KeyboardEventEasing>(
    'keyboard'
  );
  const keyboardAnimationDuration = useSharedValue(0);
  //#endregion

  //#region effects
  useEffect(() => {
    const handleKeyboardShow = (event: KeyboardEvent) => {
      runOnUI((height, duration, easing) => {
        keyboardState.value = KEYBOARD_STATE.SHOWN;
        keyboardHeight.value = height;
        keyboardAnimationDuration.value = duration;
        keyboardAnimationEasing.value = easing;
      })(event.endCoordinates.height, event.duration, event.easing);
    };

    Keyboard.addListener(
      KEYBOARD_EVENT_MAPPER.KEYBOARD_SHOW,
      handleKeyboardShow
    );

    return () => {
      Keyboard.removeListener(
        KEYBOARD_EVENT_MAPPER.KEYBOARD_SHOW,
        handleKeyboardShow
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyboardHide = (event: KeyboardEvent) => {
      runOnUI((height, duration, easing) => {
        keyboardState.value = KEYBOARD_STATE.HIDDEN;
        keyboardHeight.value = height;
        keyboardAnimationDuration.value = duration;
        keyboardAnimationEasing.value = easing;
      })(event.endCoordinates.height, event.duration, event.easing);
    };
    Keyboard.addListener(
      KEYBOARD_EVENT_MAPPER.KEYBOARD_HIDE,
      handleKeyboardHide
    );

    return () => {
      Keyboard.removeListener(
        KEYBOARD_EVENT_MAPPER.KEYBOARD_HIDE,
        handleKeyboardHide
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  return {
    state: keyboardState,
    height: keyboardHeight,
    animationDuration: keyboardAnimationDuration,
    animationEasing: keyboardAnimationEasing,
  };
};
