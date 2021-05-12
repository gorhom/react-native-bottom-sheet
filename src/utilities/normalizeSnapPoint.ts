/**
 * Converts a snap point to fixed numbers.
 */
export const normalizeSnapPoint = (
  snapPoint: number | string,
  containerHeight: number,
  topInset: number,
  _bottomInset: number,
  $modal: boolean
) => {
  'worklet';
  let normalizedSnapPoint = snapPoint;

  // percentage snap point
  if (typeof normalizedSnapPoint === 'string') {
    normalizedSnapPoint =
      (Number(normalizedSnapPoint.split('%')[0]) * containerHeight) / 100;
  }
  return Math.max($modal ? 0 : topInset, containerHeight - normalizedSnapPoint);
};
