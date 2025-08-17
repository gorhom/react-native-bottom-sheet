import React, {
  memo,
  useCallback,
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import { findNodeHandle } from '../../utilities';
import type { BottomSheetTextInputProps } from './types';

const BottomSheetTextInputComponent = forwardRef<
  TextInput | undefined,
  BottomSheetTextInputProps
>(({ onFocus, onBlur, ...rest }, providedRef) => {
  //#region refs
  const ref = useRef<TextInput>(null);
  //#endregion

  //#region hooks
  const { animatedKeyboardState } = useBottomSheetInternal();
  //#endregion

  //#region callbacks
  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      const keyboardState = animatedKeyboardState.get();
      animatedKeyboardState.set({
        ...keyboardState,
        target: args.nativeEvent.target,
      });
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, animatedKeyboardState]
  );
  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      /**
       * remove the keyboard state target if it belong
       * to the current component.
       */
      const keyboardState = animatedKeyboardState.get();
      if (keyboardState.target === args.nativeEvent.target) {
        animatedKeyboardState.set({
          ...keyboardState,
          target: undefined,
        });
      }
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, animatedKeyboardState]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    return () => {
      /**
       * remove the keyboard state target if it belong
       * to the current component.
       */
      const componentNode = findNodeHandle(ref.current);
      const keyboardState = animatedKeyboardState.get();
      if (keyboardState.target === componentNode) {
        animatedKeyboardState.set({
          ...keyboardState,
          target: undefined,
        });
      }
    };
  }, [animatedKeyboardState]);
  useImperativeHandle(providedRef, () => ref.current ?? undefined, []);
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
