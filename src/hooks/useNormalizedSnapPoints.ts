import { useMemo } from 'react';
import { normalizeSnapPoints } from '../utilities';

export const useNormalizedSnapPoints = (
  snapPoints: ReadonlyArray<number | string>,
  containerHeight: number = 0,
  handleHeight: number = 0
) =>
  useMemo(() => {
    const normalizedSnapPoints = normalizeSnapPoints(
      snapPoints,
      containerHeight
    );
    return normalizedSnapPoints.map(normalizedSnapPoint => {
      /**
       * we subset handleHeight from the `normalizedSnapPoint` to make
       * sure that sheets and its handle will be out of the screen.
       */
      if (normalizedSnapPoint === 0 && handleHeight !== 0) {
        normalizedSnapPoint = normalizedSnapPoint - handleHeight;
      }
      return Math.max(containerHeight - normalizedSnapPoint - handleHeight, 0);
    });
  }, [snapPoints, containerHeight, handleHeight]);
