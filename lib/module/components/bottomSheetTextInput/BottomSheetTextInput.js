"use strict";

import React, { memo, useCallback, forwardRef, useEffect } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import { jsx as _jsx } from "react/jsx-runtime";
const BottomSheetTextInputComponent = /*#__PURE__*/forwardRef(({
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  //#region hooks
  const {
    shouldHandleKeyboardEvents
  } = useBottomSheetInternal();
  //#endregion

  //#region callbacks
  const handleOnFocus = useCallback(args => {
    if (!shouldHandleKeyboardEvents.value) {
      // Schedule the update to avoid immediate work on the UI thread
      requestAnimationFrame(() => {
        shouldHandleKeyboardEvents.value = true;
      });
    }
    onFocus?.(args);
  }, [onFocus, shouldHandleKeyboardEvents]);
  const handleOnBlur = useCallback(args => {
    if (shouldHandleKeyboardEvents.value) {
      requestAnimationFrame(() => {
        shouldHandleKeyboardEvents.value = false;
      });
    }
    onBlur?.(args);
  }, [onBlur, shouldHandleKeyboardEvents]);
  //#endregion

  //#region effects
  useEffect(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);
  //#endregion
  return /*#__PURE__*/_jsx(TextInput, {
    ref: ref,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    ...rest
  });
});
const BottomSheetTextInput = /*#__PURE__*/memo(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';
export default BottomSheetTextInput;
//# sourceMappingURL=BottomSheetTextInput.js.map