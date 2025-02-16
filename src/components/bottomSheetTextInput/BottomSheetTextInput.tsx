import React, { memo, useCallback, forwardRef, useEffect } from 'react';
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetTextInputProps } from './types';

const BottomSheetTextInputComponent = forwardRef<
  TextInput,
  BottomSheetTextInputProps
>(({ onFocus, onBlur, ...rest }, ref) => {
  //#region hooks
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();
  //#endregion

  //#region callbacks
  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (!shouldHandleKeyboardEvents.value) {
        // Schedule the update to avoid immediate work on the UI thread
        requestAnimationFrame(() => {
          shouldHandleKeyboardEvents.value = true;
        });
      }
      onFocus?.(args);
    },
    [onFocus, shouldHandleKeyboardEvents]
  );

  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (shouldHandleKeyboardEvents.value) {
        requestAnimationFrame(() => {
          shouldHandleKeyboardEvents.value = false;
        });
      }
      onBlur?.(args);
    },
    [onBlur, shouldHandleKeyboardEvents]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);
  //#endregion
  return (
    <TextInput
      ref={ref}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      {...rest}
    />
  );
});

const BottomSheetTextInput = memo(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';

export default BottomSheetTextInput;
