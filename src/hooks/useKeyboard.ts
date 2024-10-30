import { useEffect } from 'react';
import {
  Keyboard,
  type KeyboardEvent,
  type KeyboardEventEasing,
  type KeyboardEventName,
  Platform,
} from 'react-native';
import {
  runOnUI,
  useAnimatedReaction,
  useSharedValue,
  useWorkletCallback,
} from 'react-native-reanimated';
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

const DEBOUNCE_TIME = 100; // ms

export const useKeyboard = () => {
  //#region variables
  const shouldHandleKeyboardEvents = useSharedValue(false);
  const keyboardState = useSharedValue<KEYBOARD_STATE>(
    KEYBOARD_STATE.UNDETERMINED
  );
  const keyboardHeight = useSharedValue(0);
  const keyboardAnimationEasing =
    useSharedValue<KeyboardEventEasing>('keyboard');
  const keyboardAnimationDuration = useSharedValue(500);
  const temporaryCachedKeyboardEvent = useSharedValue<any[]>([]);
  const debounceTimer = useSharedValue<number | null>(null);
  //#endregion

  //#region worklets
  const handleKeyboardEvent = useWorkletCallback(
    (
      state: KEYBOARD_STATE,
      height: number,
      duration: number,
      easing: KeyboardEventEasing
    ) => {
      if (state === KEYBOARD_STATE.SHOWN && !shouldHandleKeyboardEvents.value) {
        temporaryCachedKeyboardEvent.value = [state, height, duration, easing];
        return;
      }

      if (debounceTimer.value !== null) {
        clearTimeout(debounceTimer.value);
      }

      debounceTimer.value = setTimeout(() => {
        keyboardHeight.value =
          state === KEYBOARD_STATE.SHOWN
            ? height
            : height === 0
            ? keyboardHeight.value
            : height;
        keyboardAnimationDuration.value = duration;
        keyboardAnimationEasing.value = easing;
        keyboardState.value = state;
        temporaryCachedKeyboardEvent.value = [];
        debounceTimer.value = null;
      }, DEBOUNCE_TIME);
    },
    []
  );
  //#endregion

  //#region effects
  useEffect(() => {
    const handleOnKeyboardShow = (event: KeyboardEvent) => {
      runOnUI(handleKeyboardEvent)(
        KEYBOARD_STATE.SHOWN,
        event.endCoordinates.height,
        event.duration,
        event.easing
      );
    };
    const handleOnKeyboardHide = (event: KeyboardEvent) => {
      runOnUI(handleKeyboardEvent)(
        KEYBOARD_STATE.HIDDEN,
        event.endCoordinates.height,
        event.duration,
        event.easing
      );
    };

    const showSubscription = Keyboard.addListener(
      KEYBOARD_EVENT_MAPPER.KEYBOARD_SHOW,
      handleOnKeyboardShow
    );

    const hideSubscription = Keyboard.addListener(
      KEYBOARD_EVENT_MAPPER.KEYBOARD_HIDE,
      handleOnKeyboardHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardEvent]);

  useAnimatedReaction(
    () => shouldHandleKeyboardEvents.value,
    result => {
      const params = temporaryCachedKeyboardEvent.value;
      if (result && params.length > 0) {
        handleKeyboardEvent(params[0], params[1], params[2], params[3]);
      }
    },
    []
  );
  //#endregion

  return {
    state: keyboardState,
    height: keyboardHeight,
    animationEasing: keyboardAnimationEasing,
    animationDuration: keyboardAnimationDuration,
    shouldHandleKeyboardEvents,
  };
};
