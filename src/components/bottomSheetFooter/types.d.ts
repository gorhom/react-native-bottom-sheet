import type { ReactNode } from 'react';
import type { AccessibilityProps, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export interface BottomSheetFooterProps {
  /**
   * Calculated footer animated position.
   *
   * @type SharedValue<number>
   */
  animatedFooterPosition: SharedValue<number>;

  /**
   * When true, indicates that the Footer is an accessibility element.
   * By default, all the touchable elements are accessible.
   */
  accessible: AccessibilityProps['accessible'];
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
