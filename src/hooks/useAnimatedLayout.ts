import { useMemo, useState } from 'react';
import {
  type SharedValue,
  makeMutable,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { INITIAL_CONTAINER_LAYOUT, INITIAL_LAYOUT_VALUE } from '../constants';
import type { ContainerLayoutState, LayoutState } from '../types';

const INITIAL_STATE: LayoutState = {
  rawContainerHeight: INITIAL_LAYOUT_VALUE,
  containerHeight: INITIAL_LAYOUT_VALUE,
  containerOffset: INITIAL_CONTAINER_LAYOUT.offset,
  handleHeight: INITIAL_LAYOUT_VALUE,
  footerHeight: INITIAL_LAYOUT_VALUE,
  contentHeight: INITIAL_LAYOUT_VALUE,
};

/**
 * A custom hook that manages and animates the layout state of a container,
 * typically used in bottom sheet components. It calculates the effective
 * container height by considering top and bottom insets, and updates the
 * animated state in response to layout changes. The hook supports both modal
 * and non-modal modes, and ensures the container's animated layout state
 * remains in sync with the actual layout measurements.
 *
 * @param containerLayoutState - A shared value representing the current container layout state.
 * @param topInset - The top inset value to be subtracted from the container height.
 * @param bottomInset - The bottom inset value to be subtracted from the container height.
 * @param modal - Optional flag indicating if the layout is in modal mode.
 * @returns An object containing the animated layout state.
 */
export function useAnimatedLayout(
  containerLayoutState: SharedValue<ContainerLayoutState> | undefined,
  topInset: number,
  bottomInset: number,
  modal?: boolean
) {
  //#region  variables
  const verticalInset = useMemo(
    () => topInset + bottomInset,
    [topInset, bottomInset]
  );
  const initialState = useMemo(() => {
    const _state = { ...INITIAL_STATE };
    if (containerLayoutState) {
      const containerLayout = containerLayoutState.get();
      _state.containerHeight = modal
        ? containerLayout.height - verticalInset
        : containerLayout.height;
      _state.containerOffset = containerLayout.offset;
    }
    return _state;
  }, [containerLayoutState, modal, verticalInset]);
  //#endregion

  //#region state
  const [state] = useState(() => makeMutable(initialState));
  //#endregion

  //#region effects
  useAnimatedReaction(
    () => state.value.rawContainerHeight,
    (result, previous) => {
      if (result === previous) {
        return;
      }
      if (result === INITIAL_LAYOUT_VALUE) {
        return;
      }

      state.modify(_state => {
        'worklet';
        _state.containerHeight = modal ? result - verticalInset : result;
        return _state;
      });
    },
    [state, verticalInset, modal]
  );
  useAnimatedReaction(
    () => containerLayoutState?.get().height,
    (result, previous) => {
      if (!result || result === previous) {
        return;
      }
      if (result === INITIAL_LAYOUT_VALUE) {
        return;
      }

      state.modify(_state => {
        'worklet';
        _state.containerHeight = modal ? result - verticalInset : result;
        return _state;
      });
    },
    [state, verticalInset, modal]
  );
  //#endregion

  return {
    state,
  };
}
