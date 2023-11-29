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

var _hooks = require("../../hooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AnimatedRefreshControl = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.RefreshControl);

const BottomSheetRefreshControlComponent = /*#__PURE__*/(0, _react.forwardRef)(({
  onRefresh,
  ...rest
}, ref) => {
  // hooks
  const {
    animatedScrollableState
  } = (0, _hooks.useBottomSheetInternal)(); // variables

  const animatedProps = (0, _reactNativeReanimated.useAnimatedProps)(() => ({
    enabled: animatedScrollableState.value === _constants.SCROLLABLE_STATE.UNLOCKED
  })); // render

  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.NativeViewGestureHandler, {
    ref: ref,
    shouldCancelWhenOutside: false
  }, /*#__PURE__*/_react.default.createElement(AnimatedRefreshControl, _extends({}, rest, {
    onRefresh: onRefresh,
    animatedProps: animatedProps
  })));
});
const BottomSheetRefreshControl = /*#__PURE__*/(0, _react.memo)(BottomSheetRefreshControlComponent);
BottomSheetRefreshControl.displayName = 'BottomSheetRefreshControl';
var _default = BottomSheetRefreshControl;
exports.default = _default;
//# sourceMappingURL=BottomSheetRefreshControl.android.js.map