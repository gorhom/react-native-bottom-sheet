import React, { memo, useCallback } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { runOnUI } from 'react-native-reanimated';
import isEqual from 'lodash.isequal';
import type { BottomSheetTextInputProps } from './types';
import { useBottomSheetInternal } from '../../hooks';

const BottomSheetTextInputComponent = ({
  onFocus,
  onBlur,
  ...rest
}: BottomSheetTextInputProps) => {
  //#region hooks
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  //#endregion

  //#region callbacks
  const handleOnFocus = useCallback(
    args => {
      runOnUI(() => {
        shouldHandleKeyboardEvents.value = true;
      })();
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, shouldHandleKeyboardEvents]
  );
  const handleOnBlur = useCallback(
    args => {
      runOnUI(() => {
        shouldHandleKeyboardEvents.value = false;
      })();
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, shouldHandleKeyboardEvents]
  );
  //#endregion

  return <TextInput onFocus={handleOnFocus} onBlur={handleOnBlur} {...rest} />;
};

const BottomSheetTextInput = memo(BottomSheetTextInputComponent, isEqual);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';

export default BottomSheetTextInput;
