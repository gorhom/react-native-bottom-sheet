import React, { memo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { KEYBOARD_STATE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import { INITIAL_HANDLE_HEIGHT } from '../bottomSheet/constants';
import type { BottomSheetFooterContainerProps } from './types';

const BottomSheetFooterContainerComponent = ({
  footerComponent: FooterComponent,
}: BottomSheetFooterContainerProps) => {
  //#region hooks
  const {
    animatedContainerHeight,
    animatedHandleHeight,
    animatedFooterHeight,
    animatedPosition,
    animatedKeyboardState,
    animatedKeyboardHeightInContainer,
  } = useBottomSheetInternal();
  //#endregion

  //#region variables
  const animatedFooterPosition = useDerivedValue(() => {
    const handleHeight = animatedHandleHeight.get();
    if (handleHeight === INITIAL_HANDLE_HEIGHT) {
      return 0;
    }

    const keyboardHeight = animatedKeyboardHeightInContainer.get();
    const containerHeight = animatedContainerHeight.get();
    const position = animatedPosition.get();
    const keyboardState = animatedKeyboardState.get();
    const footerHeight = animatedFooterHeight.get();

    let footerTranslateY = Math.max(0, containerHeight - position);
    if (keyboardState === KEYBOARD_STATE.SHOWN) {
      footerTranslateY = footerTranslateY - keyboardHeight;
    }

    footerTranslateY = footerTranslateY - footerHeight - handleHeight;
    return footerTranslateY;
  }, [
    animatedKeyboardHeightInContainer,
    animatedContainerHeight,
    animatedPosition,
    animatedKeyboardState,
    animatedFooterHeight,
    animatedHandleHeight,
  ]);
  //#endregion

  return <FooterComponent animatedFooterPosition={animatedFooterPosition} />;
};

export const BottomSheetFooterContainer = memo(
  BottomSheetFooterContainerComponent
);
BottomSheetFooterContainer.displayName = 'BottomSheetFooterContainer';
