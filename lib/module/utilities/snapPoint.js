"use strict";

export const snapPoint = (value, velocity, points) => {
  'worklet';

  const point = value + 0.2 * velocity;
  const deltas = points.map(p => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter(p => Math.abs(point - p) === minDelta)[0];
};
//# sourceMappingURL=snapPoint.js.map