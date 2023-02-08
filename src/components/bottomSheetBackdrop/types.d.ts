import { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type {
  BottomSheetVariables,
  NullableAccessibilityProps,
} from '../../types';

export interface BottomSheetBackdropProps
  extends Pick<ViewProps, 'style'>,
    BottomSheetVariables {}

export type BackdropPressBehavior = 'none' | 'close' | 'collapse' | number;

export interface BottomSheetDefaultBackdropProps
  extends BottomSheetBackdropProps,
    NullableAccessibilityProps {
  /**
   * Backdrop opacity.
   * @type number
   * @default 0.5
   */
  opacity?: number;
  /**
   * Snap point index when backdrop will appears on.
   * @type number
   * @default 1
   */
  appearsOnIndex?: number;
  /**
   * Snap point index when backdrop will disappears on.
   * @type number
   * @default 0
   */
  disappearsOnIndex?: number;
  /**
   * Enable touch through backdrop component.
   * @type boolean
   * @default false
   */
  enableTouchThrough?: boolean;
  /**
   * What should happen when user press backdrop?
   * @type BackdropPressBehavior
   * @default 'close'
   */
  pressBehavior?: BackdropPressBehavior;

  /**
   * Function which will be executed on pressing backdrop component
   * @type {Function}
   */
  onPress?: () => void;
  /**
   * Child component that will be rendered on backdrop.
   */
  children?: ReactNode | ReactNode[];
}
