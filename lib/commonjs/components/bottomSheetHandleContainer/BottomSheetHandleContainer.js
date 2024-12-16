"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _hooks = require("../../hooks");
var _utilities = require("../../utilities");
var _constants = require("../bottomSheet/constants");
var _bottomSheetHandle = _interopRequireDefault(require("../bottomSheetHandle"));
var _styles = require("./styles");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function BottomSheetHandleContainerComponent({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture = _constants.DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
  handleHeight,
  handleComponent: _providedHandleComponent,
  handleStyle: _providedHandleStyle,
  handleIndicatorStyle: _providedIndicatorStyle
}) {
  //#region hooks
  const {
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
    waitFor,
    simultaneousHandlers: _providedSimultaneousHandlers
  } = (0, _hooks.useBottomSheetInternal)();
  const {
    handlePanGestureHandler
  } = (0, _hooks.useBottomSheetGestureHandlers)();
  //#endregion

  //#region variables
  const simultaneousHandlers = (0, _react.useMemo)(() => {
    const refs = [];
    if (_internalSimultaneousHandlers) {
      refs.push(_internalSimultaneousHandlers);
    }
    if (_providedSimultaneousHandlers) {
      if (Array.isArray(_providedSimultaneousHandlers)) {
        refs.push(..._providedSimultaneousHandlers);
      } else {
        refs.push(_providedSimultaneousHandlers);
      }
    }
    return refs;
  }, [_providedSimultaneousHandlers, _internalSimultaneousHandlers]);
  const panGesture = (0, _react.useMemo)(() => {
    let gesture = _reactNativeGestureHandler.Gesture.Pan().enabled(enableHandlePanningGesture).shouldCancelWhenOutside(false).runOnJS(false).onStart(handlePanGestureHandler.handleOnStart).onChange(handlePanGestureHandler.handleOnChange).onEnd(handlePanGestureHandler.handleOnEnd).onFinalize(handlePanGestureHandler.handleOnFinalize);
    if (waitFor) {
      gesture = gesture.requireExternalGestureToFail(waitFor);
    }
    if (simultaneousHandlers) {
      gesture = gesture.simultaneousWithExternalGesture(simultaneousHandlers);
    }
    if (activeOffsetX) {
      gesture = gesture.activeOffsetX(activeOffsetX);
    }
    if (activeOffsetY) {
      gesture = gesture.activeOffsetY(activeOffsetY);
    }
    if (failOffsetX) {
      gesture = gesture.failOffsetX(failOffsetX);
    }
    if (failOffsetY) {
      gesture = gesture.failOffsetY(failOffsetY);
    }
    return gesture;
  }, [activeOffsetX, activeOffsetY, enableHandlePanningGesture, failOffsetX, failOffsetY, simultaneousHandlers, waitFor, handlePanGestureHandler.handleOnChange, handlePanGestureHandler.handleOnEnd, handlePanGestureHandler.handleOnFinalize, handlePanGestureHandler.handleOnStart]);
  //#endregion

  //#region callbacks
  const handleContainerLayout = (0, _react.useCallback)(function handleContainerLayout({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    handleHeight.value = height;
    if (__DEV__) {
      (0, _utilities.print)({
        component: BottomSheetHandleContainer.displayName,
        method: 'handleContainerLayout',
        category: 'layout',
        params: {
          height
        }
      });
    }
  }, [handleHeight]);
  //#endregion

  //#region renders
  const HandleComponent = _providedHandleComponent === undefined ? _bottomSheetHandle.default : _providedHandleComponent;
  return HandleComponent !== null ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: panGesture,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      onLayout: handleContainerLayout,
      style: _styles.styles.container,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(HandleComponent, {
        animatedIndex: animatedIndex,
        animatedPosition: animatedPosition,
        style: _providedHandleStyle,
        indicatorStyle: _providedIndicatorStyle
      })
    }, "BottomSheetHandleContainer")
  }) : null;
  //#endregion
}
const BottomSheetHandleContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';
var _default = exports.default = BottomSheetHandleContainer;
//# sourceMappingURL=BottomSheetHandleContainer.js.map