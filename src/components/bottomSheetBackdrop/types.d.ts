import type { ViewProps } from 'react-native';
import type Animated from 'react-native-reanimated';

export interface BottomSheetBackdropProps extends Pick<ViewProps, 'style'> {
  /**
   * Current sheet position index.
   * @type Animated.SharedValue<number>
   */
  animatedIndex: Animated.SharedValue<number>;
  /**
   * Current sheet position.
   * @type Animated.SharedValue<number>
   */
  animatedPosition: Animated.SharedValue<number>;
}

export interface BottomSheetDefaultBackdropProps
  extends BottomSheetBackdropProps {
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
   * Close sheet when user press on backdrop.
   * @type boolean
   * @default true
   */
  closeOnPress?: boolean;
}
