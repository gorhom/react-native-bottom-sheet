import { useMemo } from 'react';
import invariant from 'invariant';
import type { BottomSheetProps } from '../components/bottomSheet';

export const usePropsValidator = ({
  index,
  snapPoints,
  topInset,
}: BottomSheetProps) => {
  useMemo(() => {
    const _snapPoints = 'value' in snapPoints ? snapPoints.value : snapPoints;
    // snap points
    invariant(
      _snapPoints,
      `'snapPoints' was not provided! please provide at least one snap point.`
    );

    invariant(
      'value' in _snapPoints || _snapPoints.length > 0,
      `'snapPoints' was provided with no points! please provide at least one snap point.`
    );

    // index
    invariant(
      typeof index === 'number' || typeof index === 'undefined',
      `'index' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      typeof index === 'number'
        ? index >= -1 && index <= _snapPoints.length - 1
        : true,
      `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
        _snapPoints.length - 1
      }`
    );

    // topInset
    invariant(
      typeof topInset === 'number' || typeof topInset === 'undefined',
      `'topInset' was provided but with wrong type ! expected type is a number.`
    );

    // animations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
