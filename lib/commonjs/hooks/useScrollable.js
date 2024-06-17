"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollable = void 0;

var _react = require("react");

var _reactNativeReanimated = require("react-native-reanimated");

var _getRefNativeTag = require("../utilities/getRefNativeTag");

var _constants = require("../constants");

const useScrollable = () => {
  // refs
  const scrollableRef = (0, _react.useRef)(null);
  const previousScrollableRef = (0, _react.useRef)(null); // variables

  const animatedScrollableType = (0, _reactNativeReanimated.useSharedValue)(_constants.SCROLLABLE_TYPE.UNDETERMINED);
  const animatedScrollableContentOffsetY = (0, _reactNativeReanimated.useSharedValue)(0);
  const animatedScrollableOverrideState = (0, _reactNativeReanimated.useSharedValue)(_constants.SCROLLABLE_STATE.UNDETERMINED);
  const isScrollableRefreshable = (0, _reactNativeReanimated.useSharedValue)(false); // callbacks

  const setScrollableRef = (0, _react.useCallback)(ref => {
    var _scrollableRef$curren, _scrollableRef$curren2;

    // get current node handle id
    let currentRefId = (_scrollableRef$curren = (_scrollableRef$curren2 = scrollableRef.current) === null || _scrollableRef$curren2 === void 0 ? void 0 : _scrollableRef$curren2.id) !== null && _scrollableRef$curren !== void 0 ? _scrollableRef$curren : null;

    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      } // @ts-ignore


      scrollableRef.current = ref;
    }
  }, []);
  const removeScrollableRef = (0, _react.useCallback)(ref => {
    var _scrollableRef$curren3, _scrollableRef$curren4;

    // find node handle id
    let id;

    try {
      id = (0, _getRefNativeTag.getRefNativeTag)(ref);
    } catch {
      return;
    } // get current node handle id


    let currentRefId = (_scrollableRef$curren3 = (_scrollableRef$curren4 = scrollableRef.current) === null || _scrollableRef$curren4 === void 0 ? void 0 : _scrollableRef$curren4.id) !== null && _scrollableRef$curren3 !== void 0 ? _scrollableRef$curren3 : null;
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