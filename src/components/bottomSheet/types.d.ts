import type React from 'react';
import type Animated from 'react-native-reanimated';
import type {
  GestureHandlerProperties,
  PanGestureHandlerProperties,
} from 'react-native-gesture-handler';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';
import type { BottomSheetBackdropProps } from '../bottomSheetBackdrop';
import type { BottomSheetBackgroundProps } from '../bottomSheetBackground';

export interface BottomSheetProps
  extends BottomSheetAnimationConfigs,
    Pick<GestureHandlerProperties, 'waitFor' | 'simultaneousHandlers'>,
    Pick<
      PanGestureHandlerProperties,
      'activeOffsetY' | 'activeOffsetX' | 'failOffsetY' | 'failOffsetX'
    > {
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
   * usually comes from `@react-navigation/stack` hook `useHeaderHeight` or
   * from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  topInset?: number;
  /**
   * Defines how violently sheet has to stopped while over dragging.
   * @type number
   * @default 2.5
   */
  overDragResistanceFactor?: number;
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
   * Enable over drag for the sheet.
   * @type boolean
   * @default true
   */
  enableOverDrag?: boolean;
  /**
   * Enable flash the scrollable indicator when the sheet is expanded.
   * @type boolean
   * @default true
   */
  enableFlashScrollableIndicatorOnExpand?: boolean;
  /**
   * To start the sheet closed and snap to initial index when it's mounted.
   * @type boolean
   * @default false
   */
  animateOnMount?: boolean;

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
  /**
   * Callback when the sheet about to animate to a new position.
   * @type (fromIndex: number, toIndex: number) => void;
   */
  onAnimate?: (fromIndex: number, toIndex: number) => void;

  // components
  /**
   * Component to be placed as a sheet handle.
   * @see {BottomSheetHandleProps}
   * @type React.FC\<BottomSheetHandleProps\>
   */
  handleComponent?: React.FC<BottomSheetHandleProps> | null;
  /**
   * Component to be placed as a sheet backdrop.
   * @see {BottomSheetBackdropProps}
   * @type React.FC\<BottomSheetBackdropProps\>
   * @default null
   */
  backdropComponent?: React.FC<BottomSheetBackdropProps> | null;
  /**
   * Component to be placed as a background.
   * @see {BottomSheetBackgroundProps}
   * @type React.FC\<BottomSheetBackgroundProps\>
   */
  backgroundComponent?: React.FC<BottomSheetBackgroundProps> | null;
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
   * @deprecated this prop will be dropped in the next major release.
   * @see animationConfigs
   */
  animationEasing?: Animated.EasingFunction;
  /**
   * Snapping animation duration.
   * @type number
   * @default 500
   * @deprecated this prop will be dropped in the next major release.
   * @see animationConfigs
   */
  animationDuration?: number;
  /**
   * Animation configs, this could be created by:
   * - `useBottomSheetSpringConfigs`
   * - `useBottomSheetTimingConfigs`
   * @type (point: number, velocity: number = 0, callback: () => void) => AnimationConfigs
   */
  animationConfigs?: (
    point: number,
    velocity: number,
    callback: () => void
  ) => number;
}
