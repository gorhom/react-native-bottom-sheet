"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _gesture = require("../../contexts/gesture");
var _hooks = require("../../hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const AnimatedRefreshControl = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.RefreshControl);
function BottomSheetRefreshControlComponent({
  onRefresh,
  scrollableGesture,
  ...rest
}) {
  //#region hooks
  const draggableGesture = (0, _react.useContext)(_gesture.BottomSheetDraggableContext);
  const {
    animatedScrollableState,
    enableContentPanningGesture
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  if (!draggableGesture && enableContentPanningGesture) {
    throw "'BottomSheetRefreshControl' cannot be used out of the BottomSheet!";
  }

  //#region variables
  const animatedProps = (0, _reactNativeReanimated.useAnimatedProps)(() => ({
    enabled: animatedScrollableState.value === _constants.SCROLLABLE_STATE.UNLOCKED
  }), [animatedScrollableState.value]);
  const gesture = (0, _react.useMemo)(() => draggableGesture ? _reactNativeGestureHandler.Gesture.Native()
  // @ts-ignore
  .simultaneousWithExternalGesture(...draggableGesture.toGestureArray(), ...scrollableGesture.toGestureArray()).shouldCancelWhenOutside(true) : undefined, [draggableGesture, scrollableGesture]);

  //#endregion

  // render
  if (gesture) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
      gesture: gesture,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedRefreshControl, {
        ...rest,
        onRefresh: onRefresh,
        animatedProps: animatedProps
      })
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedRefreshControl, {
    ...rest,
    onRefresh: onRefresh,
    animatedProps: animatedProps
  });
}
const BottomSheetRefreshControl = /*#__PURE__*/(0, _react.memo)(BottomSheetRefreshControlComponent);
BottomSheetRefreshControl.displayName = 'BottomSheetRefreshControl';
var _default = exports.default = BottomSheetRefreshControl;
//# sourceMappingURL=BottomSheetRefreshControl.android.js.map