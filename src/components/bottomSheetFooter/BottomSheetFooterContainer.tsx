import React, { memo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { INITIAL_LAYOUT_VALUE, KEYBOARD_STATUS } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetFooterContainerProps } from './types';

const BottomSheetFooterContainerComponent = ({
  footerComponent: FooterComponent,
}: BottomSheetFooterContainerProps) => {
  //#region hooks
  const { animatedLayoutState, animatedPosition, animatedKeyboardState } =
    useBottomSheetInternal();
  //#endregion

  //#region variables
  const animatedFooterPosition = useDerivedValue(() => {
    const { handleHeight, footerHeight, containerHeight } =
      animatedLayoutState.get();
    if (handleHeight === INITIAL_LAYOUT_VALUE) {
      return 0;
    }

    const { status: keyboardStatus, heightWithinContainer: keyboardHeight } =
      animatedKeyboardState.get();
    const position = animatedPosition.get();

    let footerTranslateY = Math.max(0, containerHeight - position);
    if (keyboardStatus === KEYBOARD_STATUS.SHOWN) {
      footerTranslateY = footerTranslateY - keyboardHeight;
    }

    footerTranslateY = footerTranslateY - footerHeight - handleHeight;
    return footerTranslateY;
  }, [animatedKeyboardState, animatedPosition, animatedLayoutState]);
  //#endregion

  return <FooterComponent animatedFooterPosition={animatedFooterPosition} />;
};

export const BottomSheetFooterContainer = memo(
  BottomSheetFooterContainerComponent
);
BottomSheetFooterContainer.displayName = 'BottomSheetFooterContainer';
