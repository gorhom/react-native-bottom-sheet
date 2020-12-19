import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';
import type { ViewProps } from 'react-native';

export interface BottomSheetProps extends BottomSheetAnimationConfigs {
  // configuration
  /**
   * Initial snap index, you also could provide `-1` to initiate bottom sheet in closed state.
   * @type number
   * @default 0
   */
  index?: number;
  /**
   * Points for the bottom sheet to snap to. It accepts array of number, string or mix.
   * String values should be a percentage.
   * @type Array<string | number>
   * @example
   * snapPoints={[200, 500]}
   * snapPoints={[200, '%50']}
   * snapPoints={[-1, '%100']}
   */
  snapPoints: Array<string | number>;
  /**
   * Handle height helps to calculate the internal container and sheet layouts,
   * if `handleComponent` is provided, the library internally will calculate its layout,
   * unless `handleHeight` is provided.
   * @type number
   */
  handleHeight?: number;
  /**
   * Container height helps to calculate the internal sheet layouts,
   * if `containerHeight` not provided, the library internally will calculate it,
   * however this will cause an extra re-rendering.
   * @type number
   */
  containerHeight?: number;
  /**
   * Top inset value helps to calculate percentage snap points values,
   * usually comes from `@react-navigation/stack` hook `useHeaderHeight` or from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  topInset?: number;

  // animated nodes
  /**
   * Animated value to be used as a callback of the position node internally.
   * @type Animated.Value<number>
   */
  animatedPosition?: Animated.SharedValue<number>;
  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type Animated.Value<number>
   */
  animatedIndex?: Animated.SharedValue<number>;

  // callbacks
  /**
   * Callback when sheet position changed to a provided point.
   * @type (index: number) => void;
   */
  onChange?: (index: number) => void;

  // components
  /**
   * Component to be placed as a sheet handle.
   * @see {BottomSheetHandleProps}
   * @type React.FC\<BottomSheetHandleProps\>
   */
  handleComponent?: React.FC<BottomSheetHandleProps> | null;
  /**
   * Component to be placed as a background.
   * @type React.FC\<ViewProps\>
   */
  backgroundComponent?: React.FC<ViewProps> | null;
  /**
   * A scrollable node or normal view.
   * @type React.ReactNode[] | React.ReactNode
   */
  children: (() => React.ReactNode) | React.ReactNode[] | React.ReactNode;
}

export interface BottomSheetAnimationConfigs {
  /**
   * Snapping animation easing function.
   * @type Animated.EasingFunction
   * @default Easing.out(Easing.exp)
   */
  animationEasing?: Animated.EasingFunction;
  /**
   * Snapping animation duration.
   * @type number
   * @default 500
   */
  animationDuration?: number;
}
