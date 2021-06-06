import type { EffectCallback, DependencyList } from 'react';
import type { ViewProps as RNViewProps } from 'react-native';

export interface BottomSheetViewProps extends RNViewProps {
  shouldMeasureLayout?: boolean;
  focusHook?: (effect: EffectCallback, deps?: DependencyList) => void;
  children: React.ReactNode[] | React.ReactNode;
}
