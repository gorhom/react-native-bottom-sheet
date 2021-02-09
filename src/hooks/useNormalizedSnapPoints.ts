import { useMemo } from 'react';
import { normalizeSnapPoints } from '../utilities';

export const useNormalizedSnapPoints = (
  snapPoints: Array<number | string>,
  verticalInset: number,
  containerHeight: number = 0,
  handleHeight: number = 0
) =>
  useMemo(() => {
    const normalizedSnapPoints = normalizeSnapPoints(
      snapPoints,
      containerHeight,
      verticalInset
    );
    return normalizedSnapPoints.map(normalizedSnapPoint => {
      /**
       * we subset handleHeight from the `normalizedSnapPoint` to make
       * sure that sheets and its handle will be out of the screen.
       */
      if (normalizedSnapPoint === 0 && handleHeight !== 0) {
        normalizedSnapPoint = normalizedSnapPoint - handleHeight;
      }
      return Math.max(
        containerHeight - normalizedSnapPoint - handleHeight,
        verticalInset
      );
    });
  }, [snapPoints, verticalInset, containerHeight, handleHeight]);
