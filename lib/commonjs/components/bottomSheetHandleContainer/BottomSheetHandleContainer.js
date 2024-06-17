"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _bottomSheetHandle = _interopRequireDefault(require("../bottomSheetHandle"));

var _hooks = require("../../hooks");

var _utilities = require("../../utilities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function BottomSheetHandleContainerComponent({
  animatedIndex,
  animatedPosition,
  simultaneousHandlers: _internalSimultaneousHandlers,
  enableHandlePanningGesture,
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
  } = (0, _hooks.useBottomSheetGestureHandlers)(); //#endregion
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
  }, [_providedSimultaneousHandlers, _internalSimultaneousHandlers]); //#endregion
  //#region callbacks

  const handleContainerLayout = (0, _react.useCallback)(function handleContainerLayout({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) {
    handleHeight.value = height;
    (0, _utilities.print)({
      component: BottomSheetHandleContainer.displayName,
      method: 'handleContainerLayout',
      params: {
        height
      }
    });
  }, [handleHeight]); //#endregion
  //#region renders

  const HandleComponent = _providedHandleComponent === undefined ? _bottomSheetHandle.default : _providedHandleComponent;
  return HandleComponent !== null ? /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PanGestureHandler, {
    enabled: enableHandlePanningGesture,
    waitFor: waitFor,
    simultaneousHandlers: simultaneousHandlers,
    shouldCancelWhenOutside: false,
    activeOffsetX: activeOffsetX,
    activeOffsetY: activeOffsetY,
    failOffsetX: failOffsetX,
    failOffsetY: failOffsetY,
    onGestureEvent: handlePanGestureHandler
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    key: "BottomSheetHandleContainer",
    onLayout: handleContainerLayout
  }, /*#__PURE__*/_react.default.createElement(HandleComponent, {
    animatedIndex: animatedIndex,
    animatedPosition: animatedPosition,
    style: _providedHandleStyle,
    indicatorStyle: _providedIndicatorStyle
  }))) : null; //#endregion
}

const BottomSheetHandleContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetHandleContainerComponent);
BottomSheetHandleContainer.displayName = 'BottomSheetHandleContainer';
var _default = BottomSheetHandleContainer;
exports.default = _default;
//# sourceMappingURL=BottomSheetHandleContainer.js.map