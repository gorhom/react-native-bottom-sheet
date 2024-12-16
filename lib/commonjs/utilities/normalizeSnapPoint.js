"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeSnapPoint = void 0;
/**
 * Converts a snap point to fixed numbers.
 */
const normalizeSnapPoint = (snapPoint, containerHeight) => {
  'worklet';

  let normalizedSnapPoint = snapPoint;

  // percentage snap point
  if (typeof normalizedSnapPoint === 'string') {
    normalizedSnapPoint = Number(normalizedSnapPoint.split('%')[0]) * containerHeight / 100;
  }
  return Math.max(0, containerHeight - normalizedSnapPoint);
};
exports.normalizeSnapPoint = normalizeSnapPoint;
//# sourceMappingURL=normalizeSnapPoint.js.map