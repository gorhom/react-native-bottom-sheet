"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _hooks = require("../../hooks");
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function BottomSheetFooterComponent({
  animatedFooterPosition,
  bottomInset = 0,
  style,
  children
}) {
  //#region hooks
  const {
    animatedFooterHeight,
    animatedKeyboardState
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region styles
  const containerAnimatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    let footerTranslateY = animatedFooterPosition.value;

    /**
     * Offset the bottom inset only when keyboard is not shown
     */
    if (animatedKeyboardState.value !== _constants.KEYBOARD_STATE.SHOWN) {
      footerTranslateY = footerTranslateY - bottomInset;
    }
    return {
      transform: [{
        translateY: Math.max(0, footerTranslateY)
      }]
    };
  }, [bottomInset, animatedKeyboardState, animatedFooterPosition]);
  const containerStyle = (0, _react.useMemo)(() => [_styles.styles.container, style, containerAnimatedStyle], [style, containerAnimatedStyle]);
  //#endregion

  //#region callbacks
  const handleContainerLayout = (0, _react.useCallback)(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    animatedFooterHeight.value = height;
  }, [animatedFooterHeight]);
  //#endregion

  return children !== null ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    onLayout: handleContainerLayout,
    style: containerStyle,
    children: children
  }) : null;
}
const BottomSheetFooter = /*#__PURE__*/(0, _react.memo)(BottomSheetFooterComponent);
BottomSheetFooter.displayName = 'BottomSheetFooter';
var _default = exports.default = BottomSheetFooter;
//# sourceMappingURL=BottomSheetFooter.js.map