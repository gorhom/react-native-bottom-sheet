"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStableCallback = useStableCallback;
var _react = require("react");
/**
 * Provide a stable version of useCallback.
 */
function useStableCallback(callback) {
  const callbackRef = (0, _react.useRef)();
  (0, _react.useLayoutEffect)(() => {
    callbackRef.current = callback;
  });
  (0, _react.useEffect)(() => {
    return () => {
      callbackRef.current = undefined;
    };
  }, []);
  return (0, _react.useCallback)((...args) => {
    return callbackRef.current?.(...args);
  }, []);
}
//# sourceMappingURL=useStableCallback.js.map