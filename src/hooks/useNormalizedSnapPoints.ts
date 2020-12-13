import { useMemo } from 'react';
import { normalizeSnapPoints } from '../utilities';

export const useNormalizedSnapPoints = (
  snapPoints: Array<number | string>,
  topInset: number,
  containerHeight: number = 0,
  handleHeight: number = 0
) =>
  useMemo(() => {
    const normalizedSnapPoints = normalizeSnapPoints(
      snapPoints,
      containerHeight,
      topInset
    );
    return normalizedSnapPoints.map(normalizedSnapPoint => {
      return Math.ceil(
        Math.max(containerHeight - normalizedSnapPoint - handleHeight, topInset)
      );
    });
  }, [snapPoints, topInset, containerHeight, handleHeight]);
