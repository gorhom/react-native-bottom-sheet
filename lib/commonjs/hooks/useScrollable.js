"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollable = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
const useScrollable = () => {
  // refs
  const scrollableRef = (0, _react.useRef)(null);
  const previousScrollableRef = (0, _react.useRef)(null);

  // variables
  const animatedScrollableType = (0, _reactNativeReanimated.useSharedValue)(_constants.SCROLLABLE_TYPE.UNDETERMINED);
  const animatedScrollableContentOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const animatedScrollableOverrideState = (0, _reactNativeReanimated.useSharedValue)(_constants.SCROLLABLE_STATE.UNDETERMINED);
  const isScrollableRefreshable = (0, _reactNativeReanimated.useSharedValue)(false);

  // callbacks
  const setScrollableRef = (0, _react.useCallback)(ref => {
    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;
    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-ignore
      scrollableRef.current = ref;
    }
  }, []);
  const removeScrollableRef = (0, _react.useCallback)(ref => {
    // find node handle id
    let id;
    try {
      id = (0, _reactNative.findNodeHandle)(ref.current);
    } catch {
      return;
    }

    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;

    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */
    if (id === currentRefId) {
      // @ts-ignore
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);
  return {
    scrollableRef,
    animatedScrollableType,
    animatedScrollableContentOffsetY,
    animatedScrollableOverrideState,
    isScrollableRefreshable,
    setScrollableRef,
    removeScrollableRef
  };
};
exports.useScrollable = useScrollable;
//# sourceMappingURL=useScrollable.js.map