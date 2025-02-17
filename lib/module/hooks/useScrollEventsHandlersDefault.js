"use strict";

import { State } from 'react-native-gesture-handler';
import { scrollTo, useWorkletCallback } from 'react-native-reanimated';
import { ANIMATION_STATE, SCROLLABLE_STATE, SHEET_STATE } from '../constants';
import { useBottomSheetInternal } from './useBottomSheetInternal';
export const useScrollEventsHandlersDefault = (scrollableRef, scrollableContentOffsetY) => {
  // hooks
  const {
    animatedSheetState,
    animatedScrollableState,
    animatedAnimationState,
    animatedHandleGestureState,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY
  } = useBottomSheetInternal();

  //#region callbacks
  const handleOnScroll = useWorkletCallback(({
    contentOffset: {
      y
    }
  }, context) => {
    /**
     * if sheet position is extended or fill parent, then we reset
     * `shouldLockInitialPosition` value to false.
     */
    if (animatedSheetState.value === SHEET_STATE.EXTENDED || animatedSheetState.value === SHEET_STATE.FILL_PARENT) {
      context.shouldLockInitialPosition = false;
    }

    /**
     * if handle gesture state is active, then we capture the offset y position
     * and lock the scrollable with it.
     */
    if (animatedHandleGestureState.value === State.ACTIVE) {
      context.shouldLockInitialPosition = true;
      context.initialContentOffsetY = y;
    }
    if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-ignore
      scrollTo(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = lockPosition;
      return;
    }
  }, [scrollableRef, scrollableContentOffsetY, animatedScrollableState, animatedSheetState]);
  const handleOnBeginDrag = useWorkletCallback(({
    contentOffset: {
      y
    }
  }, context) => {
    scrollableContentOffsetY.value = y;
    rootScrollableContentOffsetY.value = y;
    context.initialContentOffsetY = y;

    /**
     * if sheet position not extended or fill parent and the scrollable position
     * not at the top, then we should lock the initial scrollable position.
     */
    if (animatedSheetState.value !== SHEET_STATE.EXTENDED && animatedSheetState.value !== SHEET_STATE.FILL_PARENT && y > 0) {
      context.shouldLockInitialPosition = true;
    } else {
      context.shouldLockInitialPosition = false;
    }
  }, [scrollableContentOffsetY, animatedSheetState, rootScrollableContentOffsetY]);
  const handleOnEndDrag = useWorkletCallback(({
    contentOffset: {
      y
    }
  }, context) => {
    if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-ignore
      scrollTo(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = lockPosition;
      return;
    }
    if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
      scrollableContentOffsetY.value = y;
      rootScrollableContentOffsetY.value = y;
    }
  }, [scrollableRef, scrollableContentOffsetY, animatedAnimationState, animatedScrollableState, rootScrollableContentOffsetY]);
  const handleOnMomentumEnd = useWorkletCallback(({
    contentOffset: {
      y
    }
  }, context) => {
    if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
      const lockPosition = context.shouldLockInitialPosition ? context.initialContentOffsetY ?? 0 : 0;
      // @ts-ignore
      scrollTo(scrollableRef, 0, lockPosition, false);
      scrollableContentOffsetY.value = 0;
      return;
    }
    if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
      scrollableContentOffsetY.value = y;
      rootScrollableContentOffsetY.value = y;
    }
  }, [scrollableContentOffsetY, scrollableRef, animatedAnimationState, animatedScrollableState, rootScrollableContentOffsetY]);
  //#endregion

  return {
    handleOnScroll,
    handleOnBeginDrag,
    handleOnEndDrag,
    handleOnMomentumEnd
  };
};
//# sourceMappingURL=useScrollEventsHandlersDefault.js.map