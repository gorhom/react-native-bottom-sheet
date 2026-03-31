import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { TextInput as RNTextInput } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import { findNodeHandle } from '../../utilities';
import type { BottomSheetTextInputProps } from './types';

const BottomSheetTextInputComponent = forwardRef<
  TextInput | undefined,
  BottomSheetTextInputProps
>(({ onFocus, onBlur, ...rest }, providedRef) => {
  const ref = useRef<TextInput>(null);
  const { animatedKeyboardState, textInputNodesRef } = useBottomSheetInternal();

  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      animatedKeyboardState.set(state => ({
        ...state,
        target: args.nativeEvent.target,
      }));
      onFocus?.(args);
    },
    [animatedKeyboardState, onFocus]
  );

  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      const keyboardState = animatedKeyboardState.get();
      const currentFocusedInput = findNodeHandle(
        RNTextInput.State.currentlyFocusedInput()
      );

      const shouldRemoveCurrentTarget =
        keyboardState.target === args.nativeEvent.target;
      const shouldIgnoreBlurEvent =
        currentFocusedInput &&
        textInputNodesRef.current.has(currentFocusedInput);

      if (shouldRemoveCurrentTarget && !shouldIgnoreBlurEvent) {
        animatedKeyboardState.set(state => ({
          ...state,
          target: undefined,
        }));
      }

      onBlur?.(args);
    },
    [animatedKeyboardState, onBlur, textInputNodesRef]
  );

  useEffect(() => {
    const componentNode = findNodeHandle(ref.current);
    if (!componentNode) {
      return;
    }

    textInputNodesRef.current.add(componentNode);

    return () => {
      const currentNode = findNodeHandle(ref.current);
      if (!currentNode) {
        return;
      }

      const keyboardState = animatedKeyboardState.get();
      if (keyboardState.target === currentNode) {
        animatedKeyboardState.set(state => ({
          ...state,
          target: undefined,
        }));
      }

      textInputNodesRef.current.delete(currentNode);
    };
  }, [animatedKeyboardState, textInputNodesRef]);

  useImperativeHandle(providedRef, () => ref.current ?? undefined, []);

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
