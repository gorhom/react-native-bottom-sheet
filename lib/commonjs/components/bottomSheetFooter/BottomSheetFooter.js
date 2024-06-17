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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  } = (0, _hooks.useBottomSheetInternal)(); //#endregion
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
  const containerStyle = (0, _react.useMemo)(() => [_styles.styles.container, style, containerAnimatedStyle], [style, containerAnimatedStyle]); //#endregion
  //#region callbacks

  const handleContainerLayout = (0, _react.useCallback)(({
    nativeEvent: {
      layout: {
        height
      }
    }
  }) => {
    animatedFooterHeight.value = height;
  }, [animatedFooterHeight]); //#endregion

  return children !== null ? /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    onLayout: handleContainerLayout,
    style: containerStyle
  }, typeof children === 'function' ? children() : children) : null;
}

const BottomSheetFooter = /*#__PURE__*/(0, _react.memo)(BottomSheetFooterComponent);
BottomSheetFooter.displayName = 'BottomSheetFooter';
var _default = BottomSheetFooter;
exports.default = _default;
//# sourceMappingURL=BottomSheetFooter.js.map