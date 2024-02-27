import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform } from 'react-native';
import { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import {
  useScrollHandler,
  useScrollableSetter,
  useBottomSheetInternal,
  useStableCallback,
} from '../../hooks';
import {
  GESTURE_SOURCE,
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  SCROLLABLE_STATE,
  SCROLLABLE_TYPE,
} from '../../constants';
import { styles } from './styles';

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
      // events
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onContentSizeChange,
      ...rest
    }: any = props;

    //#region refs
    const nativeGestureRef = useRef<NativeViewGestureHandler>(null);
    const refreshControlGestureRef = useRef<NativeViewGestureHandler>(null);
    //#endregion

    //#region hooks
    const { scrollableRef, scrollableContentOffsetY, scrollHandler } =
      useScrollHandler(
        scrollEventsHandlersHook,
        onScroll,
        onScrollBeginDrag,
        onScrollEndDrag
      );
    const {
      enableContentPanningGesture,
      animatedFooterHeight,
      animatedScrollableState,
      animatedContentHeight,
      enableDynamicSizing,
    } = useBottomSheetInternal();
    //#endregion

    //#region variables
    const scrollableAnimatedProps = useAnimatedProps(
      () => ({
        decelerationRate:
          SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
        showsVerticalScrollIndicator: showsVerticalScrollIndicator
          ? animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED
          : showsVerticalScrollIndicator,
      }),
      [showsVerticalScrollIndicator]
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
      focusHook
    );
    //#endregion

    //#region render
    if (Platform.OS === 'android') {
      const scrollableContent = (
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enableContentPanningGesture}
          shouldCancelWhenOutside={false}
        >
          <ScrollableComponent
            animatedProps={scrollableAnimatedProps}
            {...rest}
            scrollEventThrottle={16}
            ref={scrollableRef}
            overScrollMode={overScrollMode}
            keyboardDismissMode={keyboardDismissMode}
            onScroll={scrollHandler}
            onContentSizeChange={handleContentSizeChange}
            style={containerStyle}
          />
        </NativeViewGestureHandler>
      );
      return (
        <BottomSheetDraggableView
          nativeGestureRef={nativeGestureRef}
          refreshControlGestureRef={refreshControlGestureRef}
          gestureType={GESTURE_SOURCE.SCROLLABLE}
          style={styles.container}
        >
          {onRefresh ? (
            <BottomSheetRefreshControl
              ref={refreshControlGestureRef}
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressViewOffset={progressViewOffset}
              style={styles.container}
            >
              {scrollableContent}
            </BottomSheetRefreshControl>
          ) : (
            scrollableContent
          )}
        </BottomSheetDraggableView>
      );
    }
    return (
      <BottomSheetDraggableView
        nativeGestureRef={nativeGestureRef}
        gestureType={GESTURE_SOURCE.SCROLLABLE}
        style={styles.container}
      >
        <NativeViewGestureHandler
          ref={nativeGestureRef}
          enabled={enableContentPanningGesture}
          shouldCancelWhenOutside={false}
        >
          <ScrollableComponent
            animatedProps={scrollableAnimatedProps}
            {...rest}
            scrollEventThrottle={16}
            ref={scrollableRef}
            overScrollMode={overScrollMode}
            keyboardDismissMode={keyboardDismissMode}
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={progressViewOffset}
            refreshControl={refreshControl}
            onScroll={scrollHandler}
            onContentSizeChange={handleContentSizeChange}
            style={containerStyle}
          />
        </NativeViewGestureHandler>
      </BottomSheetDraggableView>
    );
    //#endregion
  });
}
