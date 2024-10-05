import { useCallback } from 'react';
import { useBottomSheetInternal } from '../../hooks';

/**
 * A hook to set the content size properly into the bottom sheet,
 * internals.
 *
 * @param enableFooterMarginAdjustment Adjust the scrollable bottom margin to avoid the animated footer.
 * @returns
 */
export function useBottomSheetContentSizeSetter(
  enableFooterMarginAdjustment: boolean
) {
  //#region hooks
  const { enableDynamicSizing, animatedContentHeight, animatedFooterHeight } =
    useBottomSheetInternal();
  //#endregion

  //#region methods
  const setContentSize = useCallback(
    (contentHeight: number) => {
      if (enableDynamicSizing) {
        animatedContentHeight.value =
          contentHeight +
          (enableFooterMarginAdjustment ? animatedFooterHeight.value : 0);
      }
    },
    [
      enableDynamicSizing,
      animatedContentHeight,
      animatedFooterHeight,
      enableFooterMarginAdjustment,
    ]
  );
  //#endregion

  return {
    setContentSize,
  };
}
