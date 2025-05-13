"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBottomSheetContentSizeSetter = useBottomSheetContentSizeSetter;
var _react = require("react");
var _hooks = require("../../hooks");
/**
 * A hook to set the content size properly into the bottom sheet,
 * internals.
 */
function useBottomSheetContentSizeSetter() {
  //#region hooks
  const {
    enableDynamicSizing,
    animatedContentHeight
  } = (0, _hooks.useBottomSheetInternal)();
  //#endregion

  //#region methods
  const setContentSize = (0, _react.useCallback)(contentHeight => {
    if (!enableDynamicSizing) {
      return;
    }
    animatedContentHeight.value = contentHeight;
  }, [enableDynamicSizing, animatedContentHeight]);
  //#endregion

  return {
    setContentSize
  };
}
//# sourceMappingURL=useBottomSheetContentSizeSetter.js.map