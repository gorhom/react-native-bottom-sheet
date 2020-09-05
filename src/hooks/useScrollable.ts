import { useCallback, RefObject } from 'react';
import {
  findNodeHandle,
  FlatList,
  ScrollView,
  SectionList,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import type { ScrollableRef, Scrollable } from '../types';

export const useScrollable = () => {
  // refs
  const scrollableRef = useAnimatedRef<ScrollableRef>(null);
  const previousScrollableRef = useAnimatedRef<ScrollableRef>(null);

  // variables
  const scrollableContentOffsetY: Animated.SharedValue<number> = useSharedValue<
    number
  >(0);

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
        (node as FlatList).scrollToOffset({
          animated: false,
          offset: 0,
        });
        break;

      case 'ScrollView':
        (node as ScrollView).scrollTo({
          y: 0,
          animated: false,
        });
        break;

      case 'SectionList':
        if ((node as SectionList).props.sections.length === 0) {
          return;
        }
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

    console.log('X', type, node);

    if (!type || !node) {
      return;
    }

    // @ts-ignore
    if (node.flashScrollIndicators) {
      // @ts-ignore
      node.flashScrollIndicators();
    }
  }, []);

  // events
  const handleScrollEvent = useAnimatedScrollHandler({
    onBeginDrag: event => {
      scrollableContentOffsetY.value = event.contentOffset.y;
    },
  });

  return {
    scrollableRef,
    scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
    scrollToTop,
    flashScrollableIndicators,
  };
};
