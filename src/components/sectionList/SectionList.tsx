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
import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
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
    const panGestureRef = useRef<PanGestureHandler>(null);
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const sectionListRef = useRef<RNSectionList>(null);

    // hooks
    const {
      rootTapGestureRef,
      sheetPanGestureState,
      sheetPanGestureTranslationY,
      sheetPanGestureVelocityY,
      scrollableContentOffsetY,
      setScrollableRef,
    } = useBottomSheetInternal();

    // callbacks
    const handleGestureEvent = useMemo(
      () =>
        event([
          {
            nativeEvent: {
              state: sheetPanGestureState,
              translationY: sheetPanGestureTranslationY,
              velocityY: sheetPanGestureVelocityY,
            },
          },
        ]),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => sectionListRef.current!.getNode());
    useFocusHook(handleFocus);

    // render
    return (
      <PanGestureHandler
        ref={panGestureRef}
        simultaneousHandlers={[rootTapGestureRef, nativeGestureRef]}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureEvent}
      >
        <Animated.View style={styles.container}>
          <NativeViewGestureHandler
            ref={nativeGestureRef}
            waitFor={rootTapGestureRef}
            simultaneousHandlers={panGestureRef}
          >
            <AnimatedSectionList
              {...rest}
              ref={sectionListRef}
              overScrollMode="never"
              bounces={false}
              decelerationRate={0.99999}
              scrollEventThrottle={1}
              onScrollBeginDrag={handleScrollEvent}
              onScrollEndDrag={handleScrollEvent}
              onMomentumScrollBegin={handleScrollEvent}
              onMomentumScrollEnd={handleScrollEvent}
            />
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

export default (SectionList as any) as typeof BottomSheetSectionList;
