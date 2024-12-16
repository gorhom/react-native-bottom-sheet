"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../../constants");
var _hooks = require("../../hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BottomSheetFooterContainerComponent = ({
  footerComponent: FooterComponent
}) => {
  //#region hooks
  const {
    animatedContainerHeight,
    animatedHandleHeight,
    animatedFooterHeight,
    animatedPosition,
    animatedKeyboardState,
    animatedKeyboardHeightInContainer
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region variables
  const animatedFooterPosition = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const keyboardHeight = animatedKeyboardHeightInContainer.value;
    let footerTranslateY = Math.max(0, animatedContainerHeight.value - animatedPosition.value);
    if (animatedKeyboardState.value === _constants.KEYBOARD_STATE.SHOWN) {
      footerTranslateY = footerTranslateY - keyboardHeight;
    }
    footerTranslateY = footerTranslateY - animatedFooterHeight.value - animatedHandleHeight.value;
    return footerTranslateY;
  }, [animatedKeyboardHeightInContainer, animatedContainerHeight, animatedPosition, animatedKeyboardState, animatedFooterHeight, animatedHandleHeight]);
  //#endregion

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(FooterComponent, {
    animatedFooterPosition: animatedFooterPosition
  });
};
const BottomSheetFooterContainer = /*#__PURE__*/(0, _react.memo)(BottomSheetFooterContainerComponent);
BottomSheetFooterContainer.displayName = 'BottomSheetFooterContainer';
var _default = exports.default = BottomSheetFooterContainer;
//# sourceMappingURL=BottomSheetFooterContainer.js.map