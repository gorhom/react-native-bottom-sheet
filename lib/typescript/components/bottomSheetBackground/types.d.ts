import type { ViewProps } from 'react-native';
import type { BottomSheetVariables } from '../../types';

export interface BottomSheetBackgroundProps
  extends Pick<ViewProps, 'pointerEvents' | 'style'>,
    BottomSheetVariables {}
