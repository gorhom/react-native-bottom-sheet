import type { ViewProps } from 'react-native';
import type {
  BottomSheetVariables,
  NullableAccessibilityProps,
} from '../../types';

export interface BottomSheetBackgroundProps
  extends Pick<ViewProps, 'pointerEvents' | 'style'>,
    BottomSheetVariables,
    Pick<NullableAccessibilityProps, 'accessible'> {}
