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
    const {
      contentContainerStyle: _contentContainerStyle,
      focusHook: useFocusHook = useEffect,
      ...rest
    } = props;

    // refs
    const panGestureRef = useRef<PanGestureHandler>(null);
    const scrollableWrapperRef = useRef<NativeViewGestureHandler>(null);
    const scrollViewRef = useRef<RNScrollView>(null);

    // hooks
    const {
      masterDrawerRef,
      decelerationRate,
      contentPaddingBottom,
      dragY,
      velocityY,
      drawerGestureState,
      drawerOldGestureState,
      lastStartScrollY,
      setScrollableRef,
    } = useBottomSheetInternal();

    // styles
    const contentContainerStyle = useMemo(() => {
      return {
        // @ts-ignore
        ...(_contentContainerStyle ?? {}),
        paddingBottom:
          contentPaddingBottom +
          Math.max(_contentContainerStyle?.paddingBottom ?? 0, 0),
      };
    }, [_contentContainerStyle, contentPaddingBottom]);

    // callbacks
    const handleGestureEvent = useMemo(
      () =>
        event([
          {
            nativeEvent: {
              translationY: dragY,
              oldState: drawerOldGestureState,
              state: drawerGestureState,
              velocityY: velocityY,
            },
          },
        ]),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    const handleOnScrollBeginDrag = useMemo(
      () =>
        event([
          {
            nativeEvent: {
              contentOffset: { y: lastStartScrollY },
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
        simultaneousHandlers={[scrollableWrapperRef, masterDrawerRef]}
        shouldCancelWhenOutside={false}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureEvent}
      >
        <Animated.View style={styles.container}>
          <NativeViewGestureHandler
            ref={scrollableWrapperRef}
            waitFor={masterDrawerRef}
            simultaneousHandlers={panGestureRef}
          >
            <AnimatedScrollView
              {...rest}
              ref={scrollViewRef}
              overScrollMode="never"
              bounces={false}
              decelerationRate={decelerationRate}
              onScrollBeginDrag={handleOnScrollBeginDrag}
              scrollEventThrottle={1}
              contentContainerStyle={contentContainerStyle}
            />
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

export default (ScrollView as any) as typeof BottomSheetScrollView;
