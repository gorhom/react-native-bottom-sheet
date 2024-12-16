"use strict";

import { useCallback } from 'react';
import { useBottomSheetInternal } from '../../hooks';

/**
 * A hook to set the content size properly into the bottom sheet,
 * internals.
 */
export function useBottomSheetContentSizeSetter() {
  //#region hooks
  const {
    enableDynamicSizing,
    animatedContentHeight
  } = useBottomSheetInternal();
  //#endregion

  //#region methods
  const setContentSize = useCallback(contentHeight => {
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