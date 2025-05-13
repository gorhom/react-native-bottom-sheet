"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../constants");
var _contexts = require("../../contexts");
var _hooks = require("../../hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BottomSheetGestureHandlersProvider = ({
  gestureEventsHandlersHook: useGestureEventsHandlers = _hooks.useGestureEventsHandlersDefault,
  children
}) => {
  //#region variables
  const animatedGestureSource = (0, _reactNativeReanimated.useSharedValue)(_constants.GESTURE_SOURCE.UNDETERMINED);
  //#endregion

  //#region hooks
  const {
    animatedContentGestureState,
    animatedHandleGestureState
  } = (0, _hooks.useBottomSheetInternal)();
  const {
    handleOnStart,
    handleOnChange,
    handleOnEnd,
    handleOnFinalize
  } = useGestureEventsHandlers();
  //#endregion

  //#region gestures
  const contentPanGestureHandler = (0, _hooks.useGestureHandler)(_constants.GESTURE_SOURCE.CONTENT, animatedContentGestureState, animatedGestureSource, handleOnStart, handleOnChange, handleOnEnd, handleOnFinalize);
  const handlePanGestureHandler = (0, _hooks.useGestureHandler)(_constants.GESTURE_SOURCE.HANDLE, animatedHandleGestureState, animatedGestureSource, handleOnStart, handleOnChange, handleOnEnd, handleOnFinalize);
  //#endregion

  //#region context
  const contextValue = (0, _react.useMemo)(() => ({
    contentPanGestureHandler,
    handlePanGestureHandler,
    animatedGestureSource
  }), [contentPanGestureHandler, handlePanGestureHandler, animatedGestureSource]);
  //#endregion
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_contexts.BottomSheetGestureHandlersContext.Provider, {
    value: contextValue,
    children: children
  });
};
var _default = exports.default = BottomSheetGestureHandlersProvider;
//# sourceMappingURL=BottomSheetGestureHandlersProvider.js.map