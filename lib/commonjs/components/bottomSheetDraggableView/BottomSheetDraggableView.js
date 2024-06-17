"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _hooks = require("../../hooks");

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const BottomSheetDraggableViewComponent = ({
  gestureType = _constants.GESTURE_SOURCE.CONTENT,
  nativeGestureRef,
  refreshControlGestureRef,
  style,
  children,
  ...rest
}) => {
  //#region hooks
  const {
    enableContentPanningGesture,
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor,
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY
  } = (0, _hooks.useBottomSheetInternal)();
  const {
    contentPanGestureHandler,
    scrollablePanGestureHandler
  } = (0, _hooks.useBottomSheetGestureHandlers)(); //#endregion
  //#region variables

  const panGestureRef = (0, _react.useRef)(null);
  const gestureHandler = (0, _react.useMemo)(() => gestureType === _constants.GESTURE_SOURCE.CONTENT ? contentPanGestureHandler : scrollablePanGestureHandler, [gestureType, contentPanGestureHandler, scrollablePanGestureHandler]);
  const simultaneousHandlers = (0, _react.useMemo)(() => {
    const refs = [];

    if (nativeGestureRef) {
      refs.push(nativeGestureRef);
    }

    if (refreshControlGestureRef) {
      refs.push(refreshControlGestureRef);
    }

    if (_providedSimultaneousHandlers) {
      if (Array.isArray(_providedSimultaneousHandlers)) {
        refs.push(..._providedSimultaneousHandlers);
      } else {
        refs.push(_providedSimultaneousHandlers);
      }
    }

    return refs;
  }, [_providedSimultaneousHandlers, nativeGestureRef, refreshControlGestureRef]); //#endregion

  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PanGestureHandler, {
    ref: panGestureRef,
    enabled: enableContentPanningGesture,
    simultaneousHandlers: simultaneousHandlers,
    shouldCancelWhenOutside: false,
    waitFor: waitFor,
    onGestureEvent: gestureHandler,
    activeOffsetX: activeOffsetX,
    activeOffsetY: activeOffsetY,
    failOffsetX: failOffsetX,
    failOffsetY: failOffsetY
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({
    style: style
  }, rest), children));
};

const BottomSheetDraggableView = /*#__PURE__*/(0, _react.memo)(BottomSheetDraggableViewComponent);
BottomSheetDraggableView.displayName = 'BottomSheetDraggableView';
var _default = BottomSheetDraggableView;
exports.default = _default;
//# sourceMappingURL=BottomSheetDraggableView.js.map