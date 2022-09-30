import type { ReactElement, ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';

export interface BottomSheetFooterProps {
  /**
   * Calculated footer animated position.
   *
   * @type Animated.SharedValue<number>
   */
  animatedFooterPosition: Animated.SharedValue<number>;
}

export interface BottomSheetDefaultFooterProps extends BottomSheetFooterProps {
  /**
   * Bottom inset to be added below the footer, usually comes
   * from `react-native-safe-area-context` hook `useSafeArea`.
   *
   * @type number
   * @default 0
   */
  bottomInset?: number;

  /**
   * Container style.
   *
   * @type ViewStyle
   */
  style?: ViewStyle;

  /**
   * Component to be placed in the footer.
   *
   * @type {ReactNode | ReactNode[] | (() => ReactElement)}
   */
  children?: ReactNode | ReactNode[] | (() => ReactElement);
}
