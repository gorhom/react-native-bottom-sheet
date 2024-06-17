"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function BottomSheetViewComponent({
  focusHook: useFocusHook = _react.useEffect,
  enableFooterMarginAdjustment = false,
  onLayout,
  style,
  children,
  ...rest
}) {
  //#region hooks
  const {
    animatedScrollableContentOffsetY,
    animatedScrollableType,
    animatedFooterHeight,
    enableDynamicSizing,
    animatedContentHeight
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region styles
  const flattenContainerStyle = (0, _react.useMemo)(() => _reactNative.StyleSheet.flatten(style), [style]);
  const containerStylePaddingBottom = (0, _react.useMemo)(() => {
    const paddingBottom = flattenContainerStyle && 'paddingBottom' in flattenContainerStyle ? flattenContainerStyle.paddingBottom : 0;
    return typeof paddingBottom === 'number' ? paddingBottom : 0;
  }, [flattenContainerStyle]);
  const containerStyle = (0, _react.useMemo)(() => {
    return {
      ...flattenContainerStyle,
      paddingBottom: 0
    };
  }, [flattenContainerStyle]);
  const spaceStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: 0,
    height: enableFooterMarginAdjustment ? animatedFooterHeight.value + containerStylePaddingBottom : containerStylePaddingBottom
  }), [enableFooterMarginAdjustment, containerStylePaddingBottom, animatedFooterHeight]);
  //#endregion

  //#region callbacks
  const handleSettingScrollable = (0, _react.useCallback)(() => {
    animatedScrollableContentOffsetY.value = 0;
    animatedScrollableType.value = _constants.SCROLLABLE_TYPE.VIEW;
  }, [animatedScrollableContentOffsetY, animatedScrollableType]);
  const handleLayout = (0, _react.useCallback)(event => {
    if (enableDynamicSizing) {
      animatedContentHeight.value = event.nativeEvent.layout.height;
    }
    if (onLayout) {
      onLayout(event);
    }
    (0, _utilities.print)({
      component: BottomSheetView.displayName,
      method: 'handleLayout',
      category: 'layout',
      params: {
        height: event.nativeEvent.layout.height
      }
    });
  }, [onLayout, animatedContentHeight, enableDynamicSizing]);
  //#endregion

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({
    onLayout: handleLayout,
    style: containerStyle
  }, rest), children, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "none",
    style: spaceStyle
  }));
}
const BottomSheetView = /*#__PURE__*/(0, _react.memo)(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';
var _default = exports.default = BottomSheetView;
//# sourceMappingURL=BottomSheetView.js.map