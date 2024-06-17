"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollableSetter = void 0;

var _react = require("react");

var _useBottomSheetInternal = require("./useBottomSheetInternal");

var _getRefNativeTag = require("../utilities/getRefNativeTag");

const useScrollableSetter = (ref, type, contentOffsetY, refreshable, useFocusHook = _react.useEffect) => {
  // hooks
  const {
    animatedScrollableType,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY,
    isContentHeightFixed,
    isScrollableRefreshable,
    setScrollableRef,
    removeScrollableRef
  } = (0, _useBottomSheetInternal.useBottomSheetInternal)(); // callbacks

  const handleSettingScrollable = (0, _react.useCallback)(() => {
    // set current content offset
    rootScrollableContentOffsetY.value = contentOffsetY.value;
    animatedScrollableType.value = type;
    isScrollableRefreshable.value = refreshable;
    isContentHeightFixed.value = false; // set current scrollable ref

    const id = (0, _getRefNativeTag.getRefNativeTag)(ref);

    if (id) {
      setScrollableRef({
        id: id,
        node: ref
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(ref);
    };
  }, [ref, type, refreshable, animatedScrollableType, rootScrollableContentOffsetY, contentOffsetY, isScrollableRefreshable, isContentHeightFixed, setScrollableRef, removeScrollableRef]); // effects

  useFocusHook(handleSettingScrollable);
};

exports.useScrollableSetter = useScrollableSetter;
//# sourceMappingURL=useScrollableSetter.js.map