"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _hooks = require("../../hooks");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const BottomSheetTextInputComponent = /*#__PURE__*/(0, _react.forwardRef)(({
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  //#region hooks
  const {
    shouldHandleKeyboardEvents
  } = (0, _hooks.useBottomSheetInternal)();
  (0, _react.useEffect)(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]); //#endregion
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
  }, [onBlur, shouldHandleKeyboardEvents]); //#endregion

  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.TextInput, _extends({
    ref: ref,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur
  }, rest));
});
const BottomSheetTextInput = /*#__PURE__*/(0, _react.memo)(BottomSheetTextInputComponent);
BottomSheetTextInput.displayName = 'BottomSheetTextInput';
var _default = BottomSheetTextInput;
exports.default = _default;
//# sourceMappingURL=BottomSheetTextInput.js.map