import { RefObject, useCallback } from 'react';
import { findNodeHandle } from 'react-native';
import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { SCROLLABLE_TYPE } from '../constants';
import { Scrollable } from '../types';
import type Animated from 'react-native-reanimated';

type Params = {
  type: SCROLLABLE_TYPE;
  refreshable: boolean;
  scrollableRef: RefObject<Scrollable>;
  scrollableContentOffsetY: Animated.SharedValue<number>;
};

export const useHandleSettingScrollable = ({
  type,
  scrollableRef,
  scrollableContentOffsetY,
  refreshable,
}: Params) => {
  const {
    animatedScrollableType,
    scrollableContentOffsetY: rootScrollableContentOffsetY,
    isScrollableRefreshable,
    isContentHeightFixed,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    rootScrollableContentOffsetY.value = scrollableContentOffsetY.value;
    animatedScrollableType.value = type;
    isScrollableRefreshable.value = refreshable;
    isContentHeightFixed.value = false;

    // set current scrollable ref
    const id = findNodeHandle(scrollableRef.current);
    if (id) {
      setScrollableRef({
        id: id,
        node: scrollableRef,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(scrollableRef);
    };
  }, [
    type,
    refreshable,
    isScrollableRefreshable,
    isContentHeightFixed,
    rootScrollableContentOffsetY,
    animatedScrollableType,
    scrollableContentOffsetY,
    scrollableRef,
    setScrollableRef,
    removeScrollableRef,
  ]);

  return handleSettingScrollable;
};
