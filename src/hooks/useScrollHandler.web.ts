import { type TouchEvent, useEffect, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { ANIMATION_STATE, SCROLLABLE_STATE } from '../constants';
import type { Scrollable, ScrollableEvent } from '../types';
import { useBottomSheetInternal } from './useBottomSheetInternal';

export type ScrollEventContextType = {
  initialContentOffsetY: number;
  shouldLockInitialPosition: boolean;
};

export const useScrollHandler = (_: never, onScroll?: ScrollableEvent) => {
  //#region refs
  const scrollableRef = useRef<Scrollable>(null);
  //#endregion

  //#region variables
  const scrollableContentOffsetY = useSharedValue<number>(0);
  //#endregion

  //#region hooks
  const {
    animatedScrollableState,
    animatedAnimationState,
    animatedScrollableContentOffsetY,
  } = useBottomSheetInternal();
  //#endregion

  //#region effects
  useEffect(() => {
    // biome-ignore lint: to be addressed!
    const element = findNodeHandle(scrollableRef.current) as any;

    let scrollOffset = 0;
    let supportsPassive = false;
    let maybePrevent = false;
    let lastTouchY = 0;

    let initialContentOffsetY = 0;
    const shouldLockInitialPosition = false;

    function handleOnTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        return;
      }

      initialContentOffsetY = element.scrollTop;
      lastTouchY = event.touches[0].clientY;
      maybePrevent = scrollOffset <= 0;
    }

    function handleOnTouchMove(event: TouchEvent) {
      if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
        return event.preventDefault();
      }

      if (maybePrevent) {
        maybePrevent = false;

        const touchY = event.touches[0].clientY;
        const touchYDelta = touchY - lastTouchY;

        if (touchYDelta > 0) {
          return event.preventDefault();
        }
      }

      return true;
    }

    function handleOnTouchEnd() {
      if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
        const lockPosition = shouldLockInitialPosition
          ? (initialContentOffsetY ?? 0)
          : 0;
        element.scroll({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
        scrollableContentOffsetY.value = lockPosition;
        return;
      }
    }

    function handleOnScroll(event: TouchEvent) {
      scrollOffset = element.scrollTop;

      if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
        scrollableContentOffsetY.value = Math.max(0, scrollOffset);
        animatedScrollableContentOffsetY.value = Math.max(0, scrollOffset);
      }

      if (scrollOffset <= 0) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      return true;
    }

    try {
      // @ts-ignore
      window.addEventListener('test', null, {
        // @ts-ignore
        // biome-ignore lint: to be addressed
        get passive() {
          supportsPassive = true;
        },
      });
    } catch (_e) {}

    element.addEventListener(
      'touchstart',
      handleOnTouchStart,
      supportsPassive
        ? {
            passive: true,
          }
        : false
    );

    element.addEventListener(
      'touchmove',
      handleOnTouchMove,
      supportsPassive
        ? {
            passive: false,
          }
        : false
    );

    element.addEventListener(
      'touchend',
      handleOnTouchEnd,
      supportsPassive
        ? {
            passive: false,
          }
        : false
    );

    element.addEventListener(
      'scroll',
      handleOnScroll,
      supportsPassive
        ? {
            passive: false,
          }
        : false
    );

    return () => {
      // @ts-ignore
      window.removeEventListener('test', null);
      element.removeEventListener('touchstart', handleOnTouchStart);
      element.removeEventListener('touchmove', handleOnTouchMove);
      element.removeEventListener('touchend', handleOnTouchEnd);
      element.removeEventListener('scroll', handleOnScroll);
    };
  }, [
    animatedAnimationState,
    animatedScrollableContentOffsetY,
    animatedScrollableState,
    scrollableContentOffsetY,
  ]);
  //#endregion

  return {
    scrollHandler: onScroll,
    scrollableRef,
    scrollableContentOffsetY,
  };
};
