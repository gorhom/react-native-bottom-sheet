"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _constants = require("../../constants");

var _hooks = require("../../hooks");

var _contexts = require("../../contexts");

var _reactNativeReanimated = require("react-native-reanimated");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const BottomSheetGestureHandlersProvider = ({
  gestureEventsHandlersHook: useGestureEventsHandlers = _hooks.useGestureEventsHandlersDefault,
  children
}) => {
  //#region variables
  const animatedGestureSource = (0, _reactNativeReanimated.useSharedValue)(_constants.GESTURE_SOURCE.UNDETERMINED); //#endregion
  //#region hooks

  const {
    animatedContentGestureState,
    animatedHandleGestureState
  } = (0, _hooks.useBottomSheetInternal)();
  const {
    handleOnStart,
    handleOnActive,
    handleOnEnd
  } = useGestureEventsHandlers(); //#endregion
  //#region gestures

  const contentPanGestureHandler = (0, _hooks.useGestureHandler)(_constants.GESTURE_SOURCE.CONTENT, animatedContentGestureState, animatedGestureSource, handleOnStart, handleOnActive, handleOnEnd);
  const scrollablePanGestureHandler = (0, _hooks.useGestureHandler)(_constants.GESTURE_SOURCE.SCROLLABLE, animatedContentGestureState, animatedGestureSource, handleOnStart, handleOnActive, handleOnEnd);
  const handlePanGestureHandler = (0, _hooks.useGestureHandler)(_constants.GESTURE_SOURCE.HANDLE, animatedHandleGestureState, animatedGestureSource, handleOnStart, handleOnActive, handleOnEnd); //#endregion
  //#region context

  const contextValue = (0, _react.useMemo)(() => ({
    contentPanGestureHandler,
    handlePanGestureHandler,
    scrollablePanGestureHandler,
    animatedGestureSource
  }), [contentPanGestureHandler, handlePanGestureHandler, scrollablePanGestureHandler, animatedGestureSource]); //#endregion

  return /*#__PURE__*/_react.default.createElement(_contexts.BottomSheetGestureHandlersContext.Provider, {
    value: contextValue
  }, children);
};

var _default = BottomSheetGestureHandlersProvider;
exports.default = _default;
//# sourceMappingURL=BottomSheetGestureHandlersProvider.js.map