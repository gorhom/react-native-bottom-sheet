"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _hooks = require("../../hooks");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BottomSheetTextInputComponent = /*#__PURE__*/(0, _react.forwardRef)(({
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  //#region hooks
  const {
    shouldHandleKeyboardEvents
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region callbacks
  const handleOnFocus = (0, _react.useCallback)(args => {
    shouldHandleKeyboardEvents.value = true;
    if (onFocus) {
      onFocus(args);
    }
  }, [onFocus, shouldHandleKeyboardEvents]);
  const handleOnBlur = (0, _react.useCallback)(args => {
    shouldHandleKeyboardEvents.value = false;
    if (onBlur) {
      onBlur(args);
    }
  }, [onBlur, shouldHandleKeyboardEvents]);
  //#endregion

  //#region effects
  (0, _react.useEffect)(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);
  //#endregion
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.TextInput, {
    ref: ref,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    ...rest
  });
});
const BottomSheetTextInput = /*#__PURE__*/(0, _react.memo)(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';
var _default = exports.default = BottomSheetTextInput;
//# sourceMappingURL=BottomSheetTextInput.js.map