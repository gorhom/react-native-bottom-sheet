import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { BottomSheetHandleProps } from '../handle';
import type { ViewProps } from 'react-native';

export interface BottomSheetProps extends BottomSheetAnimationConfigs {
  /**
   * Initial snap index, you also could provide {`-1`} to initiate bottom sheet in closed state.
   * @type number
   * @default 0
   */
  initialSnapIndex?: number;
  /**
   * Points for the bottom sheet to snap to. It accepts array of number, string or mix.
   * String values should be a percentage.
   * @type Array<string | number>
   * @example
   * [100, '50%', '90%']
   */
  snapPoints: Array<string | number>;
  /**
   * Top inset value helps to calculate percentage snap points values. usually comes from `@react-navigation/stack` hook `useHeaderHeight` or from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  topInset?: number;
  /**
   * To enable or disable user interaction with the sheet.
   * @type boolean
   * @default true
   */
  enabled?: boolean;
  /**
   * To messure content height and set it as largest snap point.
   * @type boolean
   * @default false
   */
  shouldMeasureContentHeight?: boolean;
  /**
   * Animated value to be used as a callback of the position node internally.
   * @type Animated.Value<number>
   */
  animatedPosition?: Animated.Value<number>;
  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type Animated.Value<number>
   */
  animatedPositionIndex?: Animated.Value<number>;
  /**
   * Component to be placed as a sheet handle.
   * @see {BottomSheetHandleProps}
   * @type React.FC\<BottomSheetHandleProps\>
   */
  handleComponent?: React.FC<BottomSheetHandleProps>;
  /**
   * Component to be placed as a background.
   * @type React.FC\<ViewProps\>
   */
  backgroundComponent?: React.FC<ViewProps>;
  /**
   * Callback when sheet position changed to a provided point.
   * @type (index: number) => void;
   */
  onChange?: (index: number) => void;
  /**
   * A scrollable node or normal view.
   * @type React.ReactNode[] | React.ReactNode
   */
  children: React.ReactNode[] | React.ReactNode;
}

export interface BottomSheetAnimationConfigs {
  /**
   * Snapping animation easing function.
   * @type Animated.EasingFunction
   * @default Easing.out(Easing.back(0.75))
   */
  animationEasing?: Animated.EasingFunction;
  /**
   * Snapping animation duration.
   * @type number
   * @default 500
   */
  animationDuration?: number;
}
