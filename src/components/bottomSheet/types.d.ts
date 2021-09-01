import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { State } from 'react-native-gesture-handler';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';
import type { BottomSheetBackgroundProps } from '../bottomSheetBackground';
import type { BottomSheetBackdropProps } from '../bottomSheetBackdrop';
import type { NullableAccessibilityProps } from '../../types';

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
   * @type ReadonlyArray<string | number>
   * @example
   * snapPoints={[200, 500]}
   * snapPoints={[200, '50%']}
   * snapPoints={[-1, '100%']}
   */
  snapPoints: ReadonlyArray<string | number>;
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
   * Top inset to be added to the bottom sheet container,
   * usually comes from `@react-navigation/stack` hook `useHeaderHeight`
   * or from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  topInset?: number;
  /**
   * Bottom inset to be added to the bottom sheet container.
   * @type number
   * @default 0
   */
  bottomInset?: number;
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

  /**
   * View style to be applied at the sheet container,
   * it also could be an Animated Style.
   * @type Animated.AnimateStyle<ViewStyle>
   * @default undefined
   */
  style?: Animated.AnimateStyle<
    Omit<
      ViewStyle,
      | 'flexDirection'
      | 'position'
      | 'top'
      | 'left'
      | 'bottom'
      | 'right'
      | 'opacity'
      | 'transform'
    >
  >;

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
   * Component to be placed as a sheet background.
   * @see {BottomSheetBackgroundProps}
   * @type React.FC\<BottomSheetBackgroundProps\>
   */
  backgroundComponent?: React.FC<BottomSheetBackgroundProps> | null;
  /**
   * A scrollable node or normal view.
   * @type React.ReactNode[] | React.ReactNode
   */
  children: (() => React.ReactNode) | React.ReactNode[] | React.ReactNode;

  // accessibility
  /**
   * Enables announcement of the snap position change on screen readers.
   * @type boolean
   * @default true
   */
  enableAccessibilityChangeAnnouncement?: boolean;
  /**
   * Callback on snap position change that announces the returned string on screen readers.
   * @type string | ((positionInScreen: string) => string)
   */
  accessibilityPositionChangeAnnouncement?:
    | string
    | ((positionInScreen: string) => string);
} & BottomSheetAnimationConfigs &
  Omit<NullableAccessibilityProps, 'accessibilityHint'>;

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

export interface BottomSheetTransitionConfig
  extends Required<BottomSheetAnimationConfigs>,
    Pick<BottomSheetProps, 'onAnimate'> {
  animatedIsLayoutReady: Animated.Value<number>;

  contentPanGestureState: Animated.Value<State>;
  contentPanGestureTranslationY: Animated.Value<number>;
  contentPanGestureVelocityY: Animated.Value<number>;

  handlePanGestureState: Animated.Value<State>;
  handlePanGestureTranslationY: Animated.Value<number>;
  handlePanGestureVelocityY: Animated.Value<number>;

  scrollableContentOffsetY: Animated.Value<number>;
  snapPoints: ReadonlyArray<number>;
  initialPosition: number;

  currentIndexRef: React.RefObject<number>;
}
