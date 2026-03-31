import type { DependencyList, EffectCallback, ReactNode } from 'react';
import type { ViewProps as RNViewProps } from 'react-native';

export interface BottomSheetViewProps extends RNViewProps {
  enableFooterMarginAdjustment?: boolean;
  focusHook?: (effect: EffectCallback, deps?: DependencyList) => void;
  children: ReactNode[] | ReactNode;
}
