"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useKeyboard = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _reactNativeReanimated = require("react-native-reanimated");

var _constants = require("../constants");

const KEYBOARD_EVENT_MAPPER = {
  KEYBOARD_SHOW: _reactNative.Platform.select({
    ios: 'keyboardWillShow',
    android: 'keyboardDidShow',
    default: ''
  }),
  KEYBOARD_HIDE: _reactNative.Platform.select({
    ios: 'keyboardWillHide',
    android: 'keyboardDidHide',
    default: ''
  })
};

const useKeyboard = () => {
  //#region variables
  const shouldHandleKeyboardEvents = (0, _reactNativeReanimated.useSharedValue)(false);
  const keyboardState = (0, _reactNativeReanimated.useSharedValue)(_constants.KEYBOARD_STATE.UNDETERMINED);
  const keyboardHeight = (0, _reactNativeReanimated.useSharedValue)(0);
  const keyboardAnimationEasing = (0, _reactNativeReanimated.useSharedValue)('keyboard');
  const keyboardAnimationDuration = (0, _reactNativeReanimated.useSharedValue)(500);
  const temporaryCachedKeyboardEvent = (0, _reactNativeReanimated.useSharedValue)([]); //#endregion
  //#region worklets

  const handleKeyboardEvent = (0, _reactNativeReanimated.useWorkletCallback)((state, height, duration, easing) => {
    if (state === _constants.KEYBOARD_STATE.SHOWN && !shouldHandleKeyboardEvents.value) {
      /**
       * if the keyboard event was fired before the `onFocus` on TextInput,
       * then we cache the input, and wait till the `shouldHandleKeyboardEvents`
       * to be updated then fire this function again.
       */
      temporaryCachedKeyboardEvent.value = [state, height, duration, easing];
      return;
    }

    keyboardHeight.value = state === _constants.KEYBOARD_STATE.SHOWN ? height : height === 0 ? keyboardHeight.value : height;
    keyboardAnimationDuration.value = duration;
    keyboardAnimationEasing.value = easing;
    keyboardState.value = state;
    temporaryCachedKeyboardEvent.value = [];
  }, []); //#endregion
  //#region effects

  (0, _react.useEffect)(() => {
    const handleOnKeyboardShow = event => {
      (0, _reactNativeReanimated.runOnUI)(handleKeyboardEvent)(_constants.KEYBOARD_STATE.SHOWN, event.endCoordinates.height, event.duration, event.easing);
    };

    const handleOnKeyboardHide = event => {
      (0, _reactNativeReanimated.runOnUI)(handleKeyboardEvent)(_constants.KEYBOARD_STATE.HIDDEN, event.endCoordinates.height, event.duration, event.easing);
    };

    const showSubscription = _reactNative.Keyboard.addListener(KEYBOARD_EVENT_MAPPER.KEYBOARD_SHOW, handleOnKeyboardShow);

    const hideSubscription = _reactNative.Keyboard.addListener(KEYBOARD_EVENT_MAPPER.KEYBOARD_HIDE, handleOnKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardEvent]);
  /**
   * This reaction is needed to handle the issue with multiline text input.
   *
   * @link https://github.com/gorhom/react-native-bottom-sheet/issues/411
   */

  (0, _reactNativeReanimated.useAnimatedReaction)(() => shouldHandleKeyboardEvents.value, result => {
    const params = temporaryCachedKeyboardEvent.value;

    if (result && params.length > 0) {
      handleKeyboardEvent(params[0], params[1], params[2], params[3]);
    }
  }); //#endregion

  return {
    state: keyboardState,
    height: keyboardHeight,
    animationEasing: keyboardAnimationEasing,
    animationDuration: keyboardAnimationDuration,
    shouldHandleKeyboardEvents
  };
};

exports.useKeyboard = useKeyboard;
//# sourceMappingURL=useKeyboard.js.map