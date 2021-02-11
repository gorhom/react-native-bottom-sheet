import invariant from 'invariant';

export const validateSnapPoint = (snapPoint: any) => {
  invariant(
    typeof snapPoint === 'number' || typeof snapPoint === 'string',
    `'${snapPoint}' is not a valid snap point! expected types are string or number.`
  );

  invariant(
    typeof snapPoint === 'number' ||
      (typeof snapPoint === 'string' && snapPoint.includes('%')),
    `'${snapPoint}' is not a valid percentage snap point! expected percentage snap point must include '%'. e.g. '50%'`
  );

  invariant(
    typeof snapPoint === 'number' ||
      (typeof snapPoint === 'string' &&
        !Number.isNaN(Number(snapPoint.split('%')[0]))),
    `'${snapPoint}' is not a valid percentage snap point! expected percentage snap point must be only numbers and '%'. e.g. '50%'`
  );
};
