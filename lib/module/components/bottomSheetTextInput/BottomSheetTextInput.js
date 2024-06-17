function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, useCallback, forwardRef, useEffect } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
const BottomSheetTextInputComponent = /*#__PURE__*/forwardRef(({
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  //#region hooks
  const {
    shouldHandleKeyboardEvents
  } = useBottomSheetInternal();
  useEffect(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]); //#endregion
  //#region callbacks

  const handleOnFocus = useCallback(args => {
    shouldHandleKeyboardEvents.value = true;

    if (onFocus) {
      onFocus(args);
    }
  }, [onFocus, shouldHandleKeyboardEvents]);
  const handleOnBlur = useCallback(args => {
    shouldHandleKeyboardEvents.value = false;

    if (onBlur) {
      onBlur(args);
    }
  }, [onBlur, shouldHandleKeyboardEvents]); //#endregion

  return /*#__PURE__*/React.createElement(TextInput, _extends({
    ref: ref,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur
  }, rest));
});
const BottomSheetTextInput = /*#__PURE__*/memo(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';
export default BottomSheetTextInput;
//# sourceMappingURL=BottomSheetTextInput.js.map