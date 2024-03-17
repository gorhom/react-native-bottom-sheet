import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { BottomSheetDraggableContext } from '../../contexts/gesture';
import {
  useScrollHandler,
  useScrollableSetter,
  useBottomSheetInternal,
  useStableCallback,
} from '../../hooks';
import {
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  SCROLLABLE_STATE,
  SCROLLABLE_TYPE,
} from '../../constants';
import { ScrollableContainer } from './ScrollableContainer';

export function createBottomSheetScrollableComponent<T, P>(
  type: SCROLLABLE_TYPE,
  ScrollableComponent: any
) {
  return forwardRef<T, P>((props, ref) => {
    // props
    const {
      // hooks
      focusHook,
      scrollEventsHandlersHook,
      // props
      enableFooterMarginAdjustment = false,
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      showsVerticalScrollIndicator = true,
      style,
      refreshing,
      onRefresh,
      progressViewOffset,
      refreshControl,
      scrollBuffer,
      preserveScrollMomentum,
      lockableScrollableContentOffsetY,
      // events
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onContentSizeChange,
      ...rest
    }: any = props;

    //#region hooks
    const draggableGesture = useContext(BottomSheetDraggableContext);
    const { scrollableRef, scrollableContentOffsetY, scrollHandler } =
      useScrollHandler(
        scrollEventsHandlersHook,
        onScroll,
        onScrollBeginDrag,
        onScrollEndDrag,
        scrollBuffer,
        preserveScrollMomentum,
        lockableScrollableContentOffsetY
      );
    const {
      animatedFooterHeight,
      animatedScrollableState,
      enableDynamicSizing,
      animatedContentHeight,
    } = useBottomSheetInternal();
    //#endregion

    //#region variables
    const scrollableAnimatedProps = useAnimatedProps(
      () => ({
        ...(preserveScrollMomentum
          ? {}
          : {
              decelerationRate:
                SCROLLABLE_DECELERATION_RATE_MAPPER[
                  animatedScrollableState.value
                ],
            }),
        showsVerticalScrollIndicator: showsVerticalScrollIndicator
          ? animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED
          : showsVerticalScrollIndicator,
      }),
      [showsVerticalScrollIndicator]
    );

    const nativeGesture = useMemo(
      () =>
        Gesture.Simultaneous(
          Gesture.Native().shouldCancelWhenOutside(false),
          draggableGesture!
        ),
      [draggableGesture]
    );
    //#endregion

    //#region callbacks
    const handleContentSizeChange = useStableCallback(
      (contentWidth: number, contentHeight: number) => {
        if (enableDynamicSizing) {
          animatedContentHeight.value =
            contentHeight +
            (enableFooterMarginAdjustment ? animatedFooterHeight.value : 0);
        }

        if (onContentSizeChange) {
          onContentSizeChange(contentWidth, contentHeight);
        }
      }
    );
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(
      () => ({
        marginBottom: enableFooterMarginAdjustment
          ? animatedFooterHeight.value
          : 0,
      }),
      [enableFooterMarginAdjustment]
    );
    const containerStyle = useMemo(() => {
      return enableFooterMarginAdjustment
        ? [
            ...(style ? ('length' in style ? style : [style]) : []),
            containerAnimatedStyle,
          ]
        : style;
    }, [enableFooterMarginAdjustment, style, containerAnimatedStyle]);
    //#endregion

    //#region effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useScrollableSetter(
      scrollableRef,
      type,
      scrollableContentOffsetY,
      onRefresh !== undefined,
      scrollBuffer,
      preserveScrollMomentum,
      focusHook
    );
    //#endregion

    //#region render
    return (
      <ScrollableContainer
        ref={scrollableRef}
        nativeGesture={nativeGesture}
        animatedProps={scrollableAnimatedProps}
        overScrollMode={overScrollMode}
        keyboardDismissMode={keyboardDismissMode}
        refreshing={refreshing}
        scrollEventThrottle={16}
        progressViewOffset={progressViewOffset}
        style={containerStyle}
        onRefresh={onRefresh}
        onScroll={scrollHandler}
        ScrollableComponent={ScrollableComponent}
        refreshControl={refreshControl}
        onContentSizeChange={handleContentSizeChange}
        {...rest}
      />
    );
    //#endregion
  });
}
