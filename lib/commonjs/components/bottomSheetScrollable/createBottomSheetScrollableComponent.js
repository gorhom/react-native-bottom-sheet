"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBottomSheetScrollableComponent = createBottomSheetScrollableComponent;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../constants");
var _gesture = require("../../contexts/gesture");
var _hooks = require("../../hooks");
var _ScrollableContainer = require("./ScrollableContainer");
var _useBottomSheetContentSizeSetter = require("./useBottomSheetContentSizeSetter");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function createBottomSheetScrollableComponent(type,
// biome-ignore lint: to be addressed!
ScrollableComponent) {
  return /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
    //#region props
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
      // biome-ignore lint: to be addressed!
    } = props;
    //#endregion

    //#region hooks
    const draggableGesture = (0, _react.useContext)(_gesture.BottomSheetDraggableContext);
    const {
      scrollableRef,
      scrollableContentOffsetY,
      scrollHandler
    } = (0, _hooks.useScrollHandler)(scrollEventsHandlersHook, onScroll, onScrollBeginDrag, onScrollEndDrag);
    const {
      animatedFooterHeight,
      animatedScrollableState,
      enableContentPanningGesture
    } = (0, _hooks.useBottomSheetInternal)();
    const {
      setContentSize
    } = (0, _useBottomSheetContentSizeSetter.useBottomSheetContentSizeSetter)();
    //#endregion

    if (!draggableGesture && enableContentPanningGesture) {
      throw "'Scrollable' cannot be used out of the BottomSheet!";
    }

    //#region variables
    const scrollableAnimatedProps = (0, _reactNativeReanimated.useAnimatedProps)(() => ({
      decelerationRate: _constants.SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
      showsVerticalScrollIndicator: showsVerticalScrollIndicator ? animatedScrollableState.value === _constants.SCROLLABLE_STATE.UNLOCKED : showsVerticalScrollIndicator
    }), [animatedScrollableState, showsVerticalScrollIndicator]);
    const scrollableGesture = (0, _react.useMemo)(() => draggableGesture ? _reactNativeGestureHandler.Gesture.Native()
    // @ts-ignore
    .simultaneousWithExternalGesture(draggableGesture).shouldCancelWhenOutside(false) : undefined, [draggableGesture]);
    //#endregion

    //#region callbacks
    const handleContentSizeChange = (0, _hooks.useStableCallback)((contentWidth, contentHeight) => {
      setContentSize(contentHeight);
      if (onContentSizeChange) {
        onContentSizeChange(contentWidth, contentHeight);
      }
    });
    //#endregion

    //#region styles
    const containerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
      marginBottom: enableFooterMarginAdjustment ? animatedFooterHeight.value : 0
    }), [animatedFooterHeight, enableFooterMarginAdjustment]);
    const containerStyle = (0, _react.useMemo)(() => {
      return enableFooterMarginAdjustment ? [...(style ? 'length' in style ? style : [style] : []), containerAnimatedStyle] : style;
    }, [enableFooterMarginAdjustment, style, containerAnimatedStyle]);
    //#endregion

    //#region effects
    // @ts-ignore
    (0, _react.useImperativeHandle)(ref, () => scrollableRef.current);
    (0, _hooks.useScrollableSetter)(scrollableRef, type, scrollableContentOffsetY, onRefresh !== undefined, focusHook);
    //#endregion

    //#region render
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ScrollableContainer.ScrollableContainer, {
      ref: scrollableRef,
      nativeGesture: scrollableGesture,
      animatedProps: scrollableAnimatedProps,
      overScrollMode: overScrollMode,
      keyboardDismissMode: keyboardDismissMode,
      refreshing: refreshing,
      scrollEventThrottle: 16,
      progressViewOffset: progressViewOffset,
      style: containerStyle,
      onRefresh: onRefresh,
      onScroll: scrollHandler,
      onContentSizeChange: handleContentSizeChange,
      setContentSize: setContentSize,
      ScrollableComponent: ScrollableComponent,
      refreshControl: refreshControl,
      ...rest
    });
    //#endregion
  });
}
//# sourceMappingURL=createBottomSheetScrollableComponent.js.map