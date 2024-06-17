function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Platform } from 'react-native';
import { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import BottomSheetDraggableView from '../bottomSheetDraggableView';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import { useScrollHandler, useScrollableSetter, useBottomSheetInternal, useStableCallback } from '../../hooks';
import { GESTURE_SOURCE, SCROLLABLE_DECELERATION_RATE_MAPPER, SCROLLABLE_STATE } from '../../constants';
import { styles } from './styles';
export function createBottomSheetScrollableComponent(type, ScrollableComponent) {
  return /*#__PURE__*/forwardRef((props, ref) => {
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
    } = props; //#region refs

    const nativeGestureRef = useRef(null);
    const refreshControlGestureRef = useRef(null); //#endregion
    //#region hooks

    const {
      scrollableRef,
      scrollableContentOffsetY,
      scrollHandler
    } = useScrollHandler(scrollEventsHandlersHook, onScroll, onScrollBeginDrag, onScrollEndDrag);
    const {
      enableContentPanningGesture,
      animatedFooterHeight,
      animatedScrollableState,
      animatedContentHeight,
      enableDynamicSizing
    } = useBottomSheetInternal(); //#endregion
    //#region variables

    const scrollableAnimatedProps = useAnimatedProps(() => ({
      decelerationRate: SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
      showsVerticalScrollIndicator: showsVerticalScrollIndicator ? animatedScrollableState.value === SCROLLABLE_STATE.UNLOCKED : showsVerticalScrollIndicator
    }), [showsVerticalScrollIndicator]); //#endregion
    //#region callbacks

    const handleContentSizeChange = useStableCallback((contentWidth, contentHeight) => {
      if (enableDynamicSizing) {
        animatedContentHeight.value = contentHeight + (enableFooterMarginAdjustment ? animatedFooterHeight.value : 0);
      }

      if (onContentSizeChange) {
        onContentSizeChange(contentWidth, contentHeight);
      }
    }); //#endregion
    //#region styles

    const containerAnimatedStyle = useAnimatedStyle(() => ({
      marginBottom: enableFooterMarginAdjustment ? animatedFooterHeight.value : 0
    }), [enableFooterMarginAdjustment]);
    const containerStyle = useMemo(() => {
      return enableFooterMarginAdjustment ? [...(style ? 'length' in style ? style : [style] : []), containerAnimatedStyle] : style;
    }, [enableFooterMarginAdjustment, style, containerAnimatedStyle]); //#endregion
    //#region effects
    // @ts-ignore

    useImperativeHandle(ref, () => scrollableRef.current);
    useScrollableSetter(scrollableRef, type, scrollableContentOffsetY, onRefresh !== undefined, focusHook); //#endregion
    //#region render

    if (Platform.OS === 'android') {
      const scrollableContent = /*#__PURE__*/React.createElement(NativeViewGestureHandler, {
        ref: nativeGestureRef,
        enabled: enableContentPanningGesture,
        shouldCancelWhenOutside: false
      }, /*#__PURE__*/React.createElement(ScrollableComponent, _extends({
        animatedProps: scrollableAnimatedProps
      }, rest, {
        scrollEventThrottle: 16,
        ref: scrollableRef,
        overScrollMode: overScrollMode,
        keyboardDismissMode: keyboardDismissMode,
        onScroll: scrollHandler,
        onContentSizeChange: handleContentSizeChange,
        style: containerStyle
      })));
      return /*#__PURE__*/React.createElement(BottomSheetDraggableView, {
        nativeGestureRef: nativeGestureRef,
        refreshControlGestureRef: refreshControlGestureRef,
        gestureType: GESTURE_SOURCE.SCROLLABLE,
        style: styles.container
      }, onRefresh ? /*#__PURE__*/React.createElement(BottomSheetRefreshControl, {
        ref: refreshControlGestureRef,
        refreshing: refreshing,
        onRefresh: onRefresh,
        progressViewOffset: progressViewOffset,
        style: styles.container
      }, scrollableContent) : scrollableContent);
    }

    return /*#__PURE__*/React.createElement(BottomSheetDraggableView, {
      nativeGestureRef: nativeGestureRef,
      gestureType: GESTURE_SOURCE.SCROLLABLE,
      style: styles.container
    }, /*#__PURE__*/React.createElement(NativeViewGestureHandler, {
      ref: nativeGestureRef,
      enabled: enableContentPanningGesture,
      shouldCancelWhenOutside: false
    }, /*#__PURE__*/React.createElement(ScrollableComponent, _extends({
      animatedProps: scrollableAnimatedProps
    }, rest, {
      scrollEventThrottle: 16,
      ref: scrollableRef,
      overScrollMode: overScrollMode,
      keyboardDismissMode: keyboardDismissMode,
      refreshing: refreshing,
      onRefresh: onRefresh,
      progressViewOffset: progressViewOffset,
      refreshControl: refreshControl,
      onScroll: scrollHandler,
      onContentSizeChange: handleContentSizeChange,
      style: containerStyle
    })))); //#endregion
  });
}
//# sourceMappingURL=createBottomSheetScrollableComponent.js.map