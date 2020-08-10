import type { EffectCallback, DependencyList } from 'react';
import type { ViewProps as RNViewProps } from 'react-native';

export type BottomSheetViewProps = RNViewProps & {
  children: React.ReactNode[] | React.ReactNode;
  focusHook?: (effect: EffectCallback, deps?: DependencyList) => void;
};
