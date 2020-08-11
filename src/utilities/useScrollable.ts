import { useCallback, useRef, RefObject, useMemo } from 'react';
import {
  findNodeHandle,
  FlatList,
  ScrollView,
  SectionList,
} from 'react-native';
import Animated, {
  useValue,
  event,
  useCode,
  onChange,
  set,
  call,
} from 'react-native-reanimated';
import { ScrollableRef, Scrollable, ScrollableType } from '../types';
import { useBottomSheetInternal } from '../hooks';

export const useScrollable = () => {
  // refs
  const scrollableRef = useRef<ScrollableRef>(null);
  const previousScrollableRef = useRef<ScrollableRef>(null);

  // variables
  const scrollableContentOffsetY: Animated.Value<number> = useValue<number>(0);

  // callbacks
  const setScrollableRef = useCallback((ref: ScrollableRef) => {
    // get current node handle id
    let currentRefId = scrollableRef.current?.id ?? null;

    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-ignore
      scrollableRef.current = ref;
    }
  }, []);

  const removeScrollableRef = useCallback((ref: RefObject<Scrollable>) => {
    // find node handle id
    let id = findNodeHandle(ref.current);

    // get current node handle id
    let currentRefId = scrollableRef.current?.id ?? null;

    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */
    if (id === currentRefId) {
      // @ts-ignore
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);

  const scrollToTop = useCallback(() => {
    let type = scrollableRef.current?.type ?? undefined;
    let node = scrollableRef.current?.node ?? undefined;

    if (!type || !node) {
      return;
    }

    switch (type) {
      case 'FlatList':
        (node as FlatList).scrollToIndex({
          animated: false,
          index: 0,
          viewPosition: 0,
          viewOffset: 1000,
        });
        break;

      case 'ScrollView':
        (node as ScrollView).scrollTo({
          y: 0,
          animated: false,
        });
        break;

      case 'SectionList':
        (node as SectionList).scrollToLocation({
          itemIndex: 0,
          sectionIndex: 0,
          viewPosition: 0,
          viewOffset: 1000,
          animated: false,
        });
        break;
    }
  }, []);

  const flashScrollableIndicators = useCallback(() => {
    let type = scrollableRef.current?.type ?? undefined;
    let node = scrollableRef.current?.node ?? undefined;

    if (!type || !node) {
      return;
    }

    // @ts-ignore
    if (node.flashScrollIndicators) {
      // @ts-ignore
      node.flashScrollIndicators();
    }
  }, []);

  return {
    scrollableRef,
    scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
    scrollToTop,
    flashScrollableIndicators,
  };
};

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
