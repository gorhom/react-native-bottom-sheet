import { useEffect } from 'react';
import { Keyboard, KeyboardEvent, KeyboardEventEasing } from 'react-native';
import { runOnUI, useSharedValue } from 'react-native-reanimated';
import { KEYBOARD_STATE } from '../constants';

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
    const handleKeyboardWillShow = (event: KeyboardEvent) => {
      runOnUI((height, duration, easing) => {
        keyboardState.value = KEYBOARD_STATE.SHOWN;
        keyboardHeight.value = height;
        keyboardAnimationDuration.value = duration;
        keyboardAnimationEasing.value = easing;
      })(event.endCoordinates.height, event.duration, event.easing);
    };
    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow);

    return () => {
      Keyboard.removeListener('keyboardWillShow', handleKeyboardWillShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyboardWillHide = (event: KeyboardEvent) => {
      runOnUI((height, duration, easing) => {
        keyboardState.value = KEYBOARD_STATE.HIDDEN;
        keyboardHeight.value = height;
        keyboardAnimationDuration.value = duration;
        keyboardAnimationEasing.value = easing;
      })(event.endCoordinates.height, event.duration, event.easing);
    };
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide);

    return () => {
      Keyboard.removeListener('keyboardWillHide', handleKeyboardWillHide);
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
