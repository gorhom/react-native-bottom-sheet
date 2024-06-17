"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStableCallback = void 0;

var _react = require("react");

/**
 * Provide a stable version of useCallback
 * https://gist.github.com/JakeCoxon/c7ebf6e6496f8468226fd36b596e1985
 */
const useStableCallback = callback => {
  const callbackRef = (0, _react.useRef)();
  const memoCallback = (0, _react.useCallback)((...args) => callbackRef.current && callbackRef.current(...args), []);
  (0, _react.useEffect)(() => {
    callbackRef.current = callback;
    return () => callbackRef.current = undefined;
  });
  return memoCallback;
};

exports.useStableCallback = useStableCallback;
//# sourceMappingURL=useStableCallback.js.map