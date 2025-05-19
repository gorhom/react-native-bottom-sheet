import { useCallback } from 'react';
import { useBottomSheetInternal } from '../../hooks';

/**
 * A hook to set the content size properly into the bottom sheet,
 * internals.
 */
export function useBottomSheetContentSizeSetter() {
  //#region hooks
  const { enableDynamicSizing, animatedContentHeight } =
    useBottomSheetInternal();
  //#endregion

  //#region methods
  const setContentSize = useCallback(
    (contentHeight: number) => {
      if (!enableDynamicSizing) {
        return;
      }
      animatedContentHeight.set(contentHeight);
    },
    [enableDynamicSizing, animatedContentHeight]
  );
  //#endregion

  return {
    setContentSize,
  };
}
