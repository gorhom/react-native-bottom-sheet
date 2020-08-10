import { useCallback, useRef, RefObject } from 'react';
import {
  findNodeHandle,
  FlatList,
  ScrollView,
  SectionList,
} from 'react-native';
import { useValue } from 'react-native-reanimated';
import { ScrollableRef, Scrollable } from '../types';

export const useScrollable = () => {
  // refs
  const scrollableRef = useRef<ScrollableRef>(null);
  const previousScrollableRef = useRef<ScrollableRef>(null);

  // variables
  const scrollableContentOffsetY = useValue<number>(0);

  // callbacks
  const setScrollableRef = useCallback((ref: RefObject<Scrollable>) => {
    // find node handle id
    let id = findNodeHandle(ref.current);

    // get current node handle id
    let currentRefId = scrollableRef.current?.id ?? null;

    // get scrollable type
    // @ts-ignore
    let type = ref.current?._component?.constructor.name ?? null;

    if (id && type && currentRefId !== id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-ignore
      scrollableRef.current = {
        id,
        type,
        // @ts-ignore
        node: ref.current!.getNode(),
      };
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
