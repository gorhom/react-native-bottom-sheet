import { useCallback } from 'react';
import { State } from 'react-native-gesture-handler';
import { scrollTo } from 'react-native-reanimated';
import { ANIMATION_STATUS, SCROLLABLE_STATUS, SHEET_STATE } from '../constants';
import type {
  ScrollEventHandlerCallbackType,
  ScrollEventsHandlersHookType,
} from '../types';
import { useBottomSheetInternal } from './useBottomSheetInternal';

export type ScrollEventContextType = {
  initialContentOffsetY: number;
  shouldLockInitialPosition: boolean;
};

/**
 * Tolerance, in points, for treating the scrollable as already resting at the
 * lock position. Sub-pixel offsets are reported during scrolling, so an exact
 * comparison would keep re-issuing `scrollTo` and never settle.
 */
const SCROLL_LOCK_EPSILON = 0.5;

export const useScrollEventsHandlersDefault: ScrollEventsHandlersHookType = (
  scrollableRef,
  scrollableContentOffsetY
) => {
  // hooks
  const {
    animatedSheetState,
    animatedScrollableState,
    animatedScrollableStatus,
    animatedAnimationState,
    animatedHandleGestureState,
  } = useBottomSheetInternal();

  //#region callbacks
  const handleOnScroll: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useCallback(
      ({ contentOffset: { y } }, context) => {
        'worklet';
        /**
         * if sheet position is extended or fill parent, then we reset
         * `shouldLockInitialPosition` value to false.
         */
        if (
          animatedSheetState.value === SHEET_STATE.EXTENDED ||
          animatedSheetState.value === SHEET_STATE.FILL_PARENT
        ) {
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

        if (animatedScrollableStatus.value === SCROLLABLE_STATUS.LOCKED) {
          const lockPosition = context.shouldLockInitialPosition
            ? (context.initialContentOffsetY ?? 0)
            : 0;
          /**
           * `scrollTo` drives the scrollable, which emits another scroll event,
           * which re-enters this handler. Issuing it unconditionally, including
           * when we are already sitting at `lockPosition`, makes that feedback
           * loop unbounded and overflows the stack. Only correct the offset when
           * it actually needs correcting.
           */
          if (Math.abs(y - lockPosition) > SCROLL_LOCK_EPSILON) {
            // @ts-expect-error
            scrollTo(scrollableRef, 0, lockPosition, false);
          }
          scrollableContentOffsetY.value = lockPosition;
          return;
        }
      },
      [
        scrollableRef,
        scrollableContentOffsetY,
        animatedScrollableStatus,
        animatedSheetState,
        animatedHandleGestureState,
      ]
    );
  const handleOnBeginDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useCallback(
      ({ contentOffset: { y } }, context) => {
        'worklet';
        scrollableContentOffsetY.value = y;
        context.initialContentOffsetY = y;
        animatedScrollableState.set(state => ({
          ...state,
          contentOffsetY: y,
        }));

        /**
         * if sheet position not extended or fill parent and the scrollable position
         * not at the top, then we should lock the initial scrollable position.
         */
        if (
          animatedSheetState.value !== SHEET_STATE.EXTENDED &&
          animatedSheetState.value !== SHEET_STATE.FILL_PARENT &&
          y > 0
        ) {
          context.shouldLockInitialPosition = true;
        } else {
          context.shouldLockInitialPosition = false;
        }
      },
      [scrollableContentOffsetY, animatedSheetState, animatedScrollableState]
    );
  const handleOnEndDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useCallback(
      ({ contentOffset: { y } }, context) => {
        'worklet';
        if (animatedScrollableStatus.value === SCROLLABLE_STATUS.LOCKED) {
          const lockPosition = context.shouldLockInitialPosition
            ? (context.initialContentOffsetY ?? 0)
            : 0;
          // @ts-expect-error
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = lockPosition;
          return;
        }

        if (animatedAnimationState.get().status !== ANIMATION_STATUS.RUNNING) {
          scrollableContentOffsetY.value = y;
          animatedScrollableState.set(state => ({
            ...state,
            contentOffsetY: y,
          }));
        }
      },
      [
        scrollableRef,
        scrollableContentOffsetY,
        animatedAnimationState,
        animatedScrollableStatus,
        animatedScrollableState,
      ]
    );
  const handleOnMomentumEnd: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useCallback(
      ({ contentOffset: { y } }, context) => {
        'worklet';
        if (animatedScrollableStatus.value === SCROLLABLE_STATUS.LOCKED) {
          const lockPosition = context.shouldLockInitialPosition
            ? (context.initialContentOffsetY ?? 0)
            : 0;
          // @ts-expect-error
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = 0;
          return;
        }

        if (animatedAnimationState.get().status !== ANIMATION_STATUS.RUNNING) {
          scrollableContentOffsetY.value = y;
          animatedScrollableState.set(state => ({
            ...state,
            contentOffsetY: y,
          }));
        }
      },
      [
        scrollableContentOffsetY,
        scrollableRef,
        animatedAnimationState,
        animatedScrollableStatus,
        animatedScrollableState,
      ]
    );
  //#endregion

  return {
    handleOnScroll,
    handleOnBeginDrag,
    handleOnEndDrag,
    handleOnMomentumEnd,
  };
};
