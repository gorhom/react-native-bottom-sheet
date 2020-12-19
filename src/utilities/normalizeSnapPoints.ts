import { validateSnapPoint } from './validateSnapPoint';

/**
 * Converts snap points with percentage to fixed numbers.
 */
export const normalizeSnapPoints = (
  snapPoints: Array<number | string>,
  containerHeight: number,
  topInset: number
) =>
  snapPoints.map(snapPoint => {
    validateSnapPoint(snapPoint);
    return typeof snapPoint === 'number'
      ? snapPoint
      : (Number(snapPoint.split('%')[0]) * (containerHeight - topInset)) / 100;
  });
