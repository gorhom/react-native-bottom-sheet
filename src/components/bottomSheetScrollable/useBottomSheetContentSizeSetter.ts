import { useCallback } from 'react';
import { useBottomSheetInternal } from '../../hooks';

/**
 * A hook to set the content size properly into the bottom sheet,
 * internals.
 */
export function useBottomSheetContentSizeSetter() {
  //#region hooks
  const { enableDynamicSizing, animatedLayoutState } = useBottomSheetInternal();
  //#endregion

  //#region methods
  const setContentSize = useCallback(
    (contentHeight: number) => {
      if (!enableDynamicSizing) {
        return;
      }
      animatedLayoutState.modify(state => {
        'worklet';
        state.contentHeight = contentHeight;
        return state;
      });
    },
    [enableDynamicSizing, animatedLayoutState]
  );
  //#endregion

  return {
    setContentSize,
  };
}
