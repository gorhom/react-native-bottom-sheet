import { useMemo } from 'react';
import { normalizeSnapPoints } from '../utilities';

export const useNormalizedSnapPoints = (
  snapPoints: Array<number | string>,
  topInset: number,
  containerHeight: number,
  handleHeight: number
) => {
  const _snapPoints = useMemo(() => {
    let normalizedSnapPoints = normalizeSnapPoints(
      snapPoints,
      containerHeight,
      topInset
    );
    normalizedSnapPoints = normalizedSnapPoints.map(normalizedSnapPoint => {
      /**
       * if user sets point to zero and `excludeHandleHeight` true,
       * we subset handleHeight from the `normalizedSnapPoint` to make
       * sure that sheets and its handle will be out of the screen.
       */
      if (normalizedSnapPoint === 0 && handleHeight !== 0) {
        normalizedSnapPoint = normalizedSnapPoint - handleHeight;
      }

      return Math.max(
        containerHeight - normalizedSnapPoint - handleHeight, // - topInset,
        topInset
      );
    });
    return normalizedSnapPoints;
  }, [snapPoints, topInset, containerHeight, handleHeight]);

  const sheetHeight = useMemo(
    () => containerHeight - _snapPoints[_snapPoints.length - 1],
    [_snapPoints, containerHeight]
  );
  return {
    snapPoints: _snapPoints,
    sheetHeight,
  };
};
