import React, {
  useMemo,
  useRef,
  useImperativeHandle,
  useEffect,
  forwardRef,
  Ref,
  useCallback,
} from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
  ViewStyle,
} from 'react-native';
import Animated, { event } from 'react-native-reanimated';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import type {
  BottomSheetScrollView,
  BottomSheetScrollViewProps,
} from './types';

import { styles } from './styles';

const AnimatedScrollView = Animated.createAnimatedComponent(
  RNScrollView
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, RNScrollViewProps>,
  any
>;

const ScrollView = forwardRef(
  (props: BottomSheetScrollViewProps, ref: Ref<RNScrollView>) => {
    // props
    const { focusHook: useFocusHook = useEffect, ...rest } = props;

    // refs
    const panGestureRef = useRef<PanGestureHandler>(null);
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const scrollViewRef = useRef<RNScrollView>(null);

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
      setScrollableRef(scrollViewRef);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollViewRef.current!.getNode());
    useFocusHook(handleFocus);

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
            <AnimatedScrollView
              {...rest}
              ref={scrollViewRef}
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

export default (ScrollView as any) as typeof BottomSheetScrollView;
