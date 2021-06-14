/**
 * Converts a snap point to fixed numbers.
 */
export const normalizeSnapPoint = (
  snapPoint: number | string,
  containerHeight: number,
  _topInset: number,
  _bottomInset: number,
  _$modal: boolean = false
) => {
  'worklet';
  let normalizedSnapPoint = snapPoint;

  // percentage snap point
  if (typeof normalizedSnapPoint === 'string') {
    normalizedSnapPoint =
      (Number(normalizedSnapPoint.split('%')[0]) * containerHeight) / 100;
  }
  return Math.max(0, containerHeight - normalizedSnapPoint);
};
