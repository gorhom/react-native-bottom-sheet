import React, { useCallback, useEffect } from 'react';
import type Animated from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import type { SCROLLABLE_TYPE } from '../constants';
import type { Scrollable } from '../types';
import { Platform, findNodeHandle } from 'react-native';

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
    animatedContainerHeight,
    animatedContentHeight,
    isScrollEnded,
  } = useBottomSheetInternal();

  // callbacks
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    rootScrollableContentOffsetY.value = contentOffsetY.value;
    animatedScrollableType.value = type;
    isScrollableRefreshable.value = refreshable;
    // Keep isScrollableLocked value if the scrollable is still scrolling
    // Android scrollview doesn't bounce so we need to set isScrollableLocked so that the sheet can be pulled up/down
    isScrollableLocked.value = (!isScrollEnded.value && isScrollableLocked.value) || (!preserveScrollMomentum && !scrollBuffer) || (Platform.OS === 'android' && animatedContentHeight.value <= animatedContainerHeight.value);
    isContentHeightFixed.value = false;

    // set current scrollable ref
    const id = findNodeHandle(ref.current);
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
