import type { EffectCallback, DependencyList, ReactNode } from 'react';
import type { ViewProps as RNViewProps } from 'react-native';

export interface BottomSheetViewProps extends RNViewProps {
  /**
   * Adjust the scrollable bottom margin to avoid the animated footer.
   *
   * @type boolean
   * @default false
   */
  enableFooterMarginAdjustment?: boolean;

  /**
   * This needed when bottom sheet used with multiple scrollables to allow bottom sheet
   * detect the current scrollable ref, especially when used with `React Navigation`.
   * You will need to provide `useFocusEffect` from `@react-navigation/native`.
   *
   * @type (effect: EffectCallback, deps?: DependencyList) => void
   * @default useEffect
   */
  focusHook?: (effect: EffectCallback, deps?: DependencyList) => void;

  children: ReactNode[] | ReactNode;
}
