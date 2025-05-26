import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet/types';

export interface BottomSheetFooterProps {
  /**
   * Calculated footer animated position.
   *
   * @type SharedValue<number>
   */
  animatedFooterPosition: SharedValue<number>;
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
   * @type {ReactNode|ReactNode[]}
   */
  children?: ReactNode | ReactNode[];
}

export interface BottomSheetFooterContainerProps
  extends Required<Pick<BottomSheetProps, 'footerComponent'>> {}
