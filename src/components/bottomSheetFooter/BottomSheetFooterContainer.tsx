import React, { memo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { KEYBOARD_STATUS } from '../../constants';
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
  } = useBottomSheetInternal();
  //#endregion

  //#region variables
  const animatedFooterPosition = useDerivedValue(() => {
    const handleHeight = animatedHandleHeight.get();
    if (handleHeight === INITIAL_HANDLE_HEIGHT) {
      return 0;
    }

    const { status: keyboardStatus, heightWithinContainer: keyboardHeight } =
      animatedKeyboardState.get();
    const containerHeight = animatedContainerHeight.get();
    const position = animatedPosition.get();
    const footerHeight = animatedFooterHeight.get();

    let footerTranslateY = Math.max(0, containerHeight - position);
    if (keyboardStatus === KEYBOARD_STATUS.SHOWN) {
      footerTranslateY = footerTranslateY - keyboardHeight;
    }

    footerTranslateY = footerTranslateY - footerHeight - handleHeight;
    return footerTranslateY;
  }, [
    animatedKeyboardState,
    animatedContainerHeight,
    animatedPosition,
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
