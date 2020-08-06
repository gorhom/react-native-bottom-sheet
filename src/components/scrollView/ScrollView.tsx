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
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import DraggableView from '../draggableView';
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

Animated.addWhitelistedUIProps({
  disableIntervalMomentum: true,
  decelerationRate: true,
});

const ScrollView = forwardRef(
  (props: BottomSheetScrollViewProps, ref: Ref<RNScrollView>) => {
    // props
    const { focusHook: useFocusHook = useEffect, ...rest } = props;

    // refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const scrollViewRef = useRef<RNScrollView>(null);

    // hooks
    const {
      rootTapGestureRef,
      scrollableContentOffsetY,
      disableIntervalMomentum,
      decelerationRate,
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
      setScrollableRef(scrollViewRef);

      return () => {
        removeScrollableRef(scrollViewRef);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // effects
    // scrollViewRef.current?.scrollResponderScrollTo(0, 0, false)
    // @ts-ignore
    useImperativeHandle(ref, () => scrollViewRef.current!.getNode());
    useFocusHook(handleFocus);

    return (
      <DraggableView
        style={styles.container}
        nativeGestureRef={nativeGestureRef}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          waitFor={rootTapGestureRef}
        >
          <AnimatedScrollView
            {...rest}
            ref={scrollViewRef}
            overScrollMode="never"
            bounces={false}
            // @ts-ignore
            disableIntervalMomentum={disableIntervalMomentum}
            decelerationRate={decelerationRate}
            scrollEventThrottle={1}
            onScrollBeginDrag={handleScrollEvent}
          />
        </NativeViewGestureHandler>
      </DraggableView>
    );
  }
);

export default (ScrollView as any) as typeof BottomSheetScrollView;
