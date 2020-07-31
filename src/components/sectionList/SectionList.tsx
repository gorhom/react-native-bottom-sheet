import React, {
  useMemo,
  useImperativeHandle,
  useEffect,
  useRef,
  Ref,
  forwardRef,
} from 'react';
import {
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
  ViewStyle,
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useBottomSheetInternal } from '../../hooks';
import { BottomSheetSectionListProps, BottomSheetSectionList } from './types';

const AnimatedSectionList = Reanimated.createAnimatedComponent(
  RNSectionList
) as React.ComponentClass<
  Reanimated.AnimateProps<ViewStyle, RNSectionListProps<any>>,
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
    const sectionListRef = useRef<RNSectionList>(null);

    // hooks
    const {
      scrollComponentRef,
      masterDrawerRef,
      drawerContentRef,
      decelerationRate,
      contentPaddingBottom,
      setScrollableRef,
      removeScrollableRef,
      onScrollBeginDrag,
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

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => sectionListRef.current!.getNode());
    useFocusHook(() => {
      setScrollableRef(sectionListRef);
      return () => {
        removeScrollableRef(sectionListRef);
      };
    }, [setScrollableRef, removeScrollableRef]);

    // render
    return (
      <NativeViewGestureHandler
        ref={scrollComponentRef}
        waitFor={masterDrawerRef}
        simultaneousHandlers={drawerContentRef}
      >
        <AnimatedSectionList
          {...rest}
          ref={sectionListRef}
          overScrollMode="never"
          bounces={false}
          decelerationRate={decelerationRate}
          onScrollBeginDrag={onScrollBeginDrag}
          scrollEventThrottle={1}
          contentContainerStyle={contentContainerStyle}
        />
      </NativeViewGestureHandler>
    );
  }
);

export default (SectionList as any) as typeof BottomSheetSectionList;
