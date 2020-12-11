import { useMemo } from 'react';
import invariant from 'invariant';
import type { BottomSheetProps } from '../components/bottomSheet';

export const usePropsValidator = ({
  index,
  snapPoints,
  topInset,
  // animation
  animationDuration,
  animationEasing,
}: BottomSheetProps) => {
  useMemo(() => {
    // snap points
    invariant(
      snapPoints,
      `'snapPoints' was not provided! please provide at least one snap point.`
    );

    invariant(
      snapPoints.length > 0,
      `'snapPoints' was provided with no points! please provide at least one snap point.`
    );

    // index
    invariant(
      typeof index === 'number' || typeof index === 'undefined',
      `'index' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      typeof index === 'number'
        ? index >= -1 && index <= snapPoints.length - 1
        : true,
      `'index' was provided but out of the provided snap points range! expected value to be between -1, ${
        snapPoints.length - 1
      }`
    );

    // topInset
    invariant(
      typeof topInset === 'number' || typeof topInset === 'undefined',
      `'topInset' was provided but with wrong type ! expected type is a number.`
    );

    // animations
    invariant(
      typeof animationDuration === 'number' ||
        typeof animationDuration === 'undefined',
      `'animationDuration' was provided but with wrong type ! expected type is a number.`
    );

    invariant(
      typeof animationDuration === 'number' ? animationDuration > 0 : true,
      `'animationDuration' was provided but the value is very low! expected value to be greater than 0`
    );

    invariant(
      typeof animationEasing === 'function' ||
        typeof animationEasing === 'undefined',
      `'animationEasing' was provided but with wrong type ! expected type is a Animated.EasingFunction.`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
