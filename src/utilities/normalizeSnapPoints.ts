import { Dimensions } from 'react-native';

const { height: windowHeight } = Dimensions.get('window');

/**
 * Converts snap points with percentage to fixed numbers.
 */
export const normalizeSnapPoints = (
  snapPoints: Array<number | string>,
  topInset: number
) =>
  snapPoints.map(snapPoint =>
    typeof snapPoint === 'number'
      ? snapPoint
      : (Number(snapPoint.split('%')[0]) * (windowHeight - topInset)) / 100
  );
