import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import type { BottomSheetProps } from '../components/bottomSheet';
import { INITIAL_LAYOUT_VALUE } from '../constants';
import type { DetentsState, LayoutState } from '../types';
import { normalizeSnapPoint } from '../utilities';

/**
 * A custom hook that computes and returns the animated detent positions for a bottom sheet component.
 *
 * This hook normalizes the provided snap points (detents), optionally adds a dynamic detent based on content size,
 * and calculates key positions such as the highest detent and the closed position. It supports both static and dynamic
 * sizing, and adapts to modal and detached sheet modes.
 *
 * @param detents - The snap points for the bottom sheet, which can be an array or an object with a `value` property.
 * @param layoutState - A shared animated value containing the current layout state (container, handle, and content heights).
 * @param enableDynamicSizing - Whether dynamic sizing based on content height is enabled.
 * @param maxDynamicContentSize - The maximum allowed content size for dynamic sizing.
 * @param detached - Whether the bottom sheet is in detached mode.
 * @param $modal - Whether the bottom sheet is presented as a modal.
 * @param bottomInset - The bottom inset to apply when the sheet is modal or detached (default is 0).
 */
export const useAnimatedDetents = (
  detents: BottomSheetProps['snapPoints'],
  layoutState: SharedValue<LayoutState>,
  enableDynamicSizing: BottomSheetProps['enableDynamicSizing'],
  maxDynamicContentSize: BottomSheetProps['maxDynamicContentSize'],
  detached: BottomSheetProps['detached'],
  $modal: BottomSheetProps['$modal'],
  bottomInset: BottomSheetProps['bottomInset'] = 0
) => {
  const state = useDerivedValue<DetentsState>(() => {
    const { containerHeight, handleHeight, contentHeight } = layoutState.get();

    // early exit, if container layout is not ready
    if (containerHeight === INITIAL_LAYOUT_VALUE) {
      return {};
    }

    // extract detents from provided props
    const _detents = detents
      ? 'value' in detents
        ? detents.value
        : detents
      : [];

    // normalized all provided detents, converting percentage
    // values into absolute values.
    let _normalizedDetents = _detents.map(snapPoint =>
      normalizeSnapPoint(snapPoint, containerHeight)
    ) as number[];

    let highestDetentPosition =
      _normalizedDetents[_normalizedDetents.length - 1];
    let closedDetentPosition = containerHeight;
    if ($modal || detached) {
      closedDetentPosition = containerHeight + bottomInset;
    }

    if (!enableDynamicSizing) {
      return {
        detents: _normalizedDetents,
        highestDetentPosition,
        closedDetentPosition,
      };
    }

    // early exit, if dynamic sizing is enabled and
    // content height is not calculated yet.
    if (contentHeight === INITIAL_LAYOUT_VALUE) {
      return {};
    }

    // early exit, if handle height is not calculated yet.
    if (handleHeight === INITIAL_LAYOUT_VALUE) {
      return {};
    }

    // calculate a new detents based on content height.
    const dynamicSnapPoint =
      containerHeight -
      Math.min(
        contentHeight + handleHeight,
        maxDynamicContentSize !== undefined
          ? maxDynamicContentSize
          : containerHeight
      );

    // push dynamic detent into the normalized detents,
    // only if it does not exists in the provided list already.
    if (!_normalizedDetents.includes(dynamicSnapPoint)) {
      _normalizedDetents.push(dynamicSnapPoint);
    }

    // sort all detents.
    _normalizedDetents = _normalizedDetents.sort((a, b) => b - a);

    // update the highest detent position.
    highestDetentPosition = _normalizedDetents[_normalizedDetents.length - 1];

    // locate the dynamic detent index.
    const dynamicDetentIndex = _normalizedDetents.indexOf(dynamicSnapPoint);

    return {
      detents: _normalizedDetents,
      dynamicDetentIndex,
      highestDetentPosition,
      closedDetentPosition,
    };
  }, [
    detents,
    layoutState,
    enableDynamicSizing,
    maxDynamicContentSize,
    detached,
    $modal,
    bottomInset,
  ]);
  return state;
};
