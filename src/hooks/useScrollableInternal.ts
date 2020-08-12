import { useCallback, useRef, useMemo } from 'react';
import { findNodeHandle } from 'react-native';
import {
  useValue,
  event,
  useCode,
  onChange,
  set,
  call,
} from 'react-native-reanimated';
import { useBottomSheetInternal } from '../hooks/useBottomSheetInternal';
import type { Scrollable, ScrollableType } from '../types';

export const useScrollableInternal = (type: ScrollableType) => {
  // refs
  const scrollableContentOffsetYRef = useRef<number>(0);
  const scrollableContentOffsetY = useValue<number>(0);
  const scrollableRef = useRef<Scrollable>(null);

  // hooks
  const {
    scrollableContentOffsetY: _scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // callbacks
  const handleScrollEvent = useMemo(
    () =>
      event([
        {
          nativeEvent: {
            contentOffset: { y: scrollableContentOffsetY },
          },
        },
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleSettingScrollable = useCallback(() => {
    _scrollableContentOffsetY.setValue(scrollableContentOffsetYRef.current);

    const id = findNodeHandle(scrollableRef.current);

    if (id) {
      setScrollableRef({
        id: id,
        type,
        // @ts-ignore
        node: scrollableRef.current!.getNode(),
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(scrollableRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // effects
  useCode(
    () =>
      onChange(scrollableContentOffsetY, [
        set(_scrollableContentOffsetY, scrollableContentOffsetY),
        call([scrollableContentOffsetY], args => {
          scrollableContentOffsetYRef.current = args[0];
        }),
      ]),
    []
  );

  return {
    scrollableRef,
    handleScrollEvent,
    handleSettingScrollable,
  };
};
