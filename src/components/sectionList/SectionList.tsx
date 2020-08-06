import React, {
  useMemo,
  useImperativeHandle,
  useEffect,
  useRef,
  Ref,
  forwardRef,
  useCallback,
} from 'react';
import {
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
  ViewStyle,
} from 'react-native';
import Animated, { event } from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import DraggableView from '../draggableView';
import { useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetSectionListProps,
  BottomSheetSectionList,
} from './types';

import { styles } from './styles';

const AnimatedSectionList = Animated.createAnimatedComponent(
  RNSectionList
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, RNSectionListProps<any>>,
  any
>;

const SectionList = forwardRef(
  (props: BottomSheetSectionListProps<any>, ref: Ref<RNSectionList>) => {
    // props
    const { focusHook: useFocusHook = useEffect, ...rest } = props;

    // refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const sectionListRef = useRef<RNSectionList>(null);

    // hooks
    const {
      rootTapGestureRef,
      scrollableContentOffsetY,
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
    const handleFocus = useCallback(() => {
      setScrollableRef(sectionListRef);

      return () => {
        removeScrollableRef(sectionListRef);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => sectionListRef.current!.getNode());
    useFocusHook(handleFocus);

    // render
    return (
      <DraggableView
        style={styles.container}
        nativeGestureRef={nativeGestureRef}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          waitFor={rootTapGestureRef}
        >
          <AnimatedSectionList
            {...rest}
            ref={sectionListRef}
            overScrollMode="never"
            bounces={false}
            decelerationRate={0.99999}
            scrollEventThrottle={1}
            onScrollBeginDrag={handleScrollEvent}
          />
        </NativeViewGestureHandler>
      </DraggableView>
    );
  }
);

export default (SectionList as any) as typeof BottomSheetSectionList;
