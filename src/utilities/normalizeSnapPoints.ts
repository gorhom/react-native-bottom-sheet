import { validateSnapPoint } from './validateSnapPoint';

/**
 * Converts snap points with percentage to fixed numbers.
 */
export const normalizeSnapPoints = (
  snapPoints: Array<number | string>,
  containerHeight: number,
  verticalInset: number
) =>
  snapPoints.map(snapPoint => {
    validateSnapPoint(snapPoint);
    return typeof snapPoint === 'number'
      ? snapPoint
      : (Number(snapPoint.split('%')[0]) * (containerHeight - verticalInset)) /
          100;
  });
