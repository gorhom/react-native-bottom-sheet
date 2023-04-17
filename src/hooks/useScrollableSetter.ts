import React, { useCallback, useEffect } from 'react';
import type Animated from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import { getRefNativeTag } from '../utilities/getRefNativeTag';
import type { SCROLLABLE_TYPE } from '../constants';
import type { Scrollable } from '../types';

export const useScrollableSetter = (
  ref: React.RefObject<Scrollable>,
  type: SCROLLABLE_TYPE,
  contentOffsetY: Animated.SharedValue<number>,
  refreshable: boolean,
  scrollBuffer: number | undefined,
  preserveScrollMomentum: boolean | undefined,
  useFocusHook = useEffect
) => {
  // hooks
  const {
    animatedScrollableType,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY,
    isContentHeightFixed,
    isScrollableRefreshable,
    isScrollableLocked,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // callbacks
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    rootScrollableContentOffsetY.value = contentOffsetY.value;
    animatedScrollableType.value = type;
    isScrollableRefreshable.value = refreshable;
    isScrollableLocked.value = !preserveScrollMomentum && !scrollBuffer;
    isContentHeightFixed.value = false;

    // set current scrollable ref
    const id = getRefNativeTag(ref);
    if (id) {
      setScrollableRef({
        id: id,
        node: ref,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(ref);
    };
  }, [
    ref,
    type,
    refreshable,
    animatedScrollableType,
    rootScrollableContentOffsetY,
    contentOffsetY,
    isScrollableRefreshable,
    isScrollableLocked,
    isContentHeightFixed,
    setScrollableRef,
    removeScrollableRef,
  ]);

  // effects
  useFocusHook(handleSettingScrollable);
};
