import React, {
  forwardRef,
  useMemo,
  Ref,
  useRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ViewStyle,
} from 'react-native';
import Animated, { event } from 'react-native-reanimated';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetFlatListProps, BottomSheetFlatList } from './types';

import { styles } from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(
  RNFlatList
) as React.ComponentClass<
  Animated.AnimateProps<ViewStyle, RNFlatListProps<any>>,
  any
>;

const FlatList = forwardRef(
  (props: BottomSheetFlatListProps<any>, ref: Ref<RNFlatList>) => {
    // props
    const {
      contentContainerStyle: _contentContainerStyle,
      focusHook: useFocusHook = useEffect,
      ...rest
    } = props;

    // refs
    const panGestureRef = useRef<PanGestureHandler>(null);
    const scrollableWrapperRef = useRef<NativeViewGestureHandler>(null);
    const flatListRef = useRef<RNFlatList>(null);

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
      setScrollableRef(flatListRef);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => flatListRef.current!.getNode());
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
            <AnimatedFlatList
              {...rest}
              ref={flatListRef}
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

export default (FlatList as any) as typeof BottomSheetFlatList;
