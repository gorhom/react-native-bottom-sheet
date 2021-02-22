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
    if (typeof snapPoint === "number") {
      return snapPoint
    } else {
      // keep two decimal places
      let result = (Number(snapPoint.split('%')[0]) * (containerHeight - topInset)) / 100;
      const decimalIndex = `${result}`.indexOf(".");
      if (decimalIndex >= 0 && `${result}`.length > (decimalIndex + 2)) {
        result = Number(`${result}`.substr(0, decimalIndex + 2 + 1));
      }
      return result
    }
  });
