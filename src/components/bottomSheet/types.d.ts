import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { State, TapGestureHandler } from 'react-native-gesture-handler';
import type { BottomSheetHandleProps } from '../defaultHandle';
import type { BottomSheetBackgroundProps } from '../defaultBackground';

export type BottomSheetProps = {
  // configuration
  /**
   * Initial snap index, you also could provide {`-1`} to initiate bottom sheet in closed state.
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
  containerHeight: number;
  /**
   * Top inset value helps to calculate percentage snap points values,
   * usually comes from `@react-navigation/stack` hook `useHeaderHeight` or from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  topInset?: number;
  /**
   * Enable content panning gesture interaction.
   * @type boolean
   * @default true
   */
  enableContentPanningGesture?: boolean;
  /**
   * Enable handle panning gesture interaction.
   * @type boolean
   * @default true
   */
  enableHandlePanningGesture?: boolean;
  /**
   * This will initially mount the sheet closed then when it calculate its layout,
   * it will snap to provided `index`.
   * @type boolean
   * @default false
   */
  animateOnMount?: boolean;
  // animated nodes
  /**
   * Animated value to be used as a callback of the position node internally.
   * @type Animated.Value<number>
   */
  animatedPosition?: Animated.Value<number>;
  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type Animated.Value<number>
   */
  animatedIndex?: Animated.Value<number>;

  // callbacks
  /**
   * Callback when the sheet position changed.
   * @type (index: number) => void;
   */
  onChange?: (index: number) => void;

  // components
  /**
   * Component to be placed as a sheet handle.
   * @see {BottomSheetHandleProps}
   * @type React.FC\<BottomSheetHandleProps\>
   */
  handleComponent?: React.FC<BottomSheetHandleProps>;
  /**
   * Component to be placed as a sheet background.
   * @type React.FC\<BottomSheetBackgroundProps\>
   */
  backgroundComponent?: React.FC<BottomSheetBackgroundProps>;
  /**
   * A scrollable node or normal view.
   * @type React.ReactNode[] | React.ReactNode
   */
  children: (() => React.ReactNode) | React.ReactNode[] | React.ReactNode;

  // internals
  /**
   * Container tap gesture state.
   * @type Animated.Value<State>
   */
  containerTapGestureState: Animated.Value<State>;
  /**
   * Container tap gesture ref.
   * @type React.RefObject<TapGestureHandler>
   */
  containerTapGestureRef: React.RefObject<TapGestureHandler>;
} & BottomSheetAnimationConfigs;

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
