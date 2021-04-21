import { useCallback, useRef, useMemo } from 'react';
import { findNodeHandle } from 'react-native';
import { event, useCode, onChange, set, call } from 'react-native-reanimated';
import { useValue } from 'react-native-redash';
import { useBottomSheetInternal } from '../hooks/useBottomSheetInternal';
import type { Scrollable, ScrollableType } from '../types';

export const useScrollableInternal = (type: ScrollableType) => {
  // refs
  const scrollableContentHeightRef = useRef<number>(0);
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
  /**
   * Reset the scrollable offset y when its size get smaller,
   * this fixes #286.
   */
  const handleOnContentSizeChange = useCallback(
    (_, height: number) => {
      if (scrollableContentHeightRef.current > height) {
        scrollableContentOffsetY.setValue(0);
      }
      scrollableContentHeightRef.current = height;
    },
    [scrollableContentOffsetY]
  );
  const handleOnBeginDragEvent = useMemo(
    () =>
      event([
        {
          nativeEvent: {
            contentOffset: { y: scrollableContentOffsetY },
          },
        },
      ]),
    [scrollableContentOffsetY]
  );
  const handleSettingScrollable = useCallback(() => {
    _scrollableContentOffsetY.setValue(scrollableContentOffsetYRef.current);

    const id = findNodeHandle(scrollableRef.current);

    if (id) {
      setScrollableRef({
        id: id,
        type,
        // @ts-ignore
        node: scrollableRef.current,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(scrollableRef);
    };
  }, [type, _scrollableContentOffsetY, removeScrollableRef, setScrollableRef]);

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
    handleOnBeginDragEvent,
    handleOnContentSizeChange,
    handleSettingScrollable,
  };
};
