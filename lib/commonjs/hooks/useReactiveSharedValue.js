"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useReactiveSharedValue = void 0;
var _react = require("react");
var _reactNativeReanimated = require("react-native-reanimated");
const useReactiveSharedValue = value => {
  const initialValueRef = (0, _react.useRef)(null);
  const valueRef = (0, _react.useRef)(null);
  if (value && typeof value === 'object' && 'value' in value) {
    /**
     * if provided value is a shared value,
     * then we do not initialize another one.
     */
  } else if (valueRef.current === null) {
    // @ts-ignore
    initialValueRef.current = value;
    /**
     * if value is an object, then we need to
     * pass a clone.
     */
    if (typeof value === 'object') {
      // @ts-ignore
      valueRef.current = (0, _reactNativeReanimated.makeMutable)({
        ...value
      });
    } else {
      // @ts-ignore
      valueRef.current = (0, _reactNativeReanimated.makeMutable)(value);
    }
  } else if (initialValueRef.current !== value) {
    valueRef.current.value = value;
  }
  (0, _react.useEffect)(() => {
    return () => {
      if (valueRef.current) {
        (0, _reactNativeReanimated.cancelAnimation)(valueRef.current);
      }
    };
  }, []);

  // @ts-ignore
  return valueRef.current ?? value;
};
exports.useReactiveSharedValue = useReactiveSharedValue;
//# sourceMappingURL=useReactiveSharedValue.js.map