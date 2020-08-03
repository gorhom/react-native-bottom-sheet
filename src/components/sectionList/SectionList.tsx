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
    const {
      contentContainerStyle: _contentContainerStyle,
      focusHook: useFocusHook = useEffect,
      ...rest
    } = props;

    // refs
    const panGestureRef = useRef<PanGestureHandler>(null);
    const scrollableWrapperRef = useRef<NativeViewGestureHandler>(null);
    const sectionListRef = useRef<RNSectionList>(null);

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
            <AnimatedSectionList
              {...rest}
              ref={sectionListRef}
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

export default (SectionList as any) as typeof BottomSheetSectionList;
