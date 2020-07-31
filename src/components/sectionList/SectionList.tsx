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

const AnimatedSectionList = Reanimated.createAnimatedComponent(
  RNSectionList
) as React.ComponentClass<
  Reanimated.AnimateProps<ViewStyle, RNSectionListProps<any>>,
  any
>;

type SectionListProps<T> = Omit<
  RNSectionListProps<T>,
  | 'overScrollMode'
  | 'bounces'
  | 'decelerationRate'
  | 'onScrollBeginDrag'
  | 'scrollEventThrottle'
>;

const SectionList = forwardRef(
  (props: SectionListProps<any>, ref: Ref<RNSectionList>) => {
    // props
    const { contentContainerStyle: _contentContainerStyle, ...rest } = props;

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
      const {
        //@ts-ignore
        paddingBottom,
        // @ts-ignore
        ...restContentContainerStyle
      } = _contentContainerStyle;
      return {
        ...restContentContainerStyle,
        paddingBottom: contentPaddingBottom + Math.max(paddingBottom ?? 0, 0),
      };
    }, [_contentContainerStyle, contentPaddingBottom]);

    // effects
    // @ts-ignore
    useImperativeHandle(ref, () => sectionListRef.current!.getNode());
    useEffect(() => {
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

export default (SectionList as any) as typeof RNSectionList;
