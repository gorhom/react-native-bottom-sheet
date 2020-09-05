const diffPoint = (p1: number, p2: number) => {
  'worklet';
  return Math.abs(p1 - p2);
};

const findMin = (array: number[]) => {
  'worklet';
  let foundNumber;
  for (let i = 0; i < array.length; i++) {
    foundNumber = !foundNumber
      ? array[i]
      : array[i] < foundNumber
      ? array[i]
      : foundNumber;
  }

  return foundNumber;
};

export const snapPoint = (
  value: number,
  velocity: number,
  points: number[]
) => {
  'worklet';

  const point = value + 0.2 * velocity;
  const deltas = points.map(p => {
    'worklet';
    return diffPoint(point, p);
  });
  const minDelta = findMin(deltas);
  return points.reduce(
    (acc, p) => (diffPoint(point, p) === minDelta ? p : acc),
    0
  );
};
