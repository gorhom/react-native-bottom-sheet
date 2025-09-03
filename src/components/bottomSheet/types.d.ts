import type React from 'react';
import type { Insets, StyleProp, View, ViewStyle } from 'react-native';
import type { PanGesture } from 'react-native-gesture-handler';
import type {
  AnimateStyle,
  ReduceMotion,
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import type {
  ANIMATION_SOURCE,
  KEYBOARD_BEHAVIOR,
  KEYBOARD_BLUR_BEHAVIOR,
  KEYBOARD_INPUT_MODE,
  SNAP_POINT_TYPE,
} from '../../constants';
import type {
  ContainerLayoutState,
  GestureEventsHandlersHookType,
  NullableAccessibilityProps,
} from '../../types';
import type { BottomSheetBackdropProps } from '../bottomSheetBackdrop';
import type { BottomSheetBackgroundProps } from '../bottomSheetBackground';
import type { BottomSheetFooterProps } from '../bottomSheetFooter';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';

export interface BottomSheetProps
  extends BottomSheetAnimationConfigs,
    Partial<BottomSheetGestureProps>,
    Omit<NullableAccessibilityProps, 'accessibilityHint'> {
  //#region configuration
  /**
   * Initial snap point index, provide `-1` to initiate bottom sheet in closed state.
   * @type number
   * @default 0
   */
  index?: number;
  /**
   * Points for the bottom sheet to snap to. It accepts array of number, string or mix.
   * String values should be a percentage.
   *
   * ⚠️ This prop is required unless you set `enableDynamicSizing` to `true`.
   * @example
   * snapPoints={[200, 500]}
   * snapPoints={[200, '%50']}
   * snapPoints={['%100']}
   * @type Array<string | number>
   */
  snapPoints?: Array<string | number> | SharedValue<Array<string | number>>;
  /**
   * Defines how violently sheet has to be stopped while over dragging.
   * @type number
   * @default 2.5
   */
  overDragResistanceFactor?: number;
  /**
   * Defines whether the bottom sheet is attached to the bottom or no.
   * @type boolean
   * @default false
   */
  detached?: boolean;
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
   * Enable pan down gesture to close the sheet.
   * @type boolean
   * @default false
   */
  enablePanDownToClose?: boolean;
  /**
   * Enable dynamic sizing for content view and scrollable content size.
   * @type boolean
   * @default true
   */
  enableDynamicSizing?: boolean;
  /**
   * To start the sheet closed and snap to initial index when it's mounted.
   * @type boolean
   * @default true
   */
  animateOnMount?: boolean;
  /**
   * To override the user reduce motion setting.
   * - `ReduceMotion.System`: if the `Reduce motion` accessibility setting is enabled on the device, disable the animation.
   * - `ReduceMotion.Always`: disable the animation, even if `Reduce motion` accessibility setting is not enabled.
   * - `ReduceMotion.Never`: enable the animation, even if `Reduce motion` accessibility setting is enabled.
   * @type ReduceMotion
   * @see https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility
   * @default ReduceMotion.System
   */
  overrideReduceMotion?: ReduceMotion;
  //#endregion

  //#region layout
  /**
   * Container height helps to calculate the internal sheet layouts,
   * if `containerHeight` not provided, the library internally will calculate it,
   * however this will cause an extra re-rendering.
   * @type number | SharedValue<number>;
   * @deprecated please use `containerLayoutState` instead.
   */
  containerHeight?: number | SharedValue<number>;
  /**
   * Container offset helps to accurately detect container offsets.
   * @type SharedValue<number>;
   * @deprecated please use `containerLayoutState` instead.
   */
  containerOffset?: SharedValue<Required<Insets>>;
  /**
   * Container layout state, this is used to calculate the container height and offsets.
   * If not provided, the library will use the default container layout state.
   * @type SharedValue<ContainerLayoutState>
   * @default undefined
   */
  containerLayoutState?: SharedValue<ContainerLayoutState>;
  /**
   * Top inset value helps to calculate percentage snap points values,
   * usually comes from `@react-navigation/stack` hook `useHeaderHeight` or
   * from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  topInset?: number;
  /**
   * Bottom inset value helps to calculate percentage snap points values,
   * usually comes from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   * @default 0
   */
  bottomInset?: number;
  /**
   * Max dynamic content size height to limit the bottom sheet height
   * from exceeding a provided size.
   * @type number
   * @default container height
   */
  maxDynamicContentSize?: number;
  //#endregion

  //#region keyboard
  /**
   * Defines the keyboard appearance behavior.
   * @enum
   * - `interactive`: offset the sheet by the size of the keyboard.
   * - `extend`: extend the sheet to its maximum snap point.
   * - `fillParent`: extend the sheet to fill parent.
   * @type `interactive` | `extend` | `fillParent`
   * @default interactive
   */
  keyboardBehavior?: keyof typeof KEYBOARD_BEHAVIOR;
  /**
   * Defines the keyboard blur behavior.
   * - `none`: do nothing.
   * - `restore`: restore sheet position.
   */
  keyboardBlurBehavior?: keyof typeof KEYBOARD_BLUR_BEHAVIOR;
  /**
   * Enable blurring the keyboard when user start to drag the bottom sheet.
   * @default false
   */
  enableBlurKeyboardOnGesture?: boolean;
  /**
   * Defines keyboard input mode for Android only.
   * @link {https://developer.android.com/guide/topics/manifest/activity-element#wsoft}
   * @type `adjustPan` | `adjustResize`
   * @default `adjustPan`
   */
  android_keyboardInputMode?: keyof typeof KEYBOARD_INPUT_MODE;

  //#endregion

  //#region styles
  /**
   * View style to be applied to the container.
   * @type ViewStyle
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * View style to be applied to the sheet container component,
   * it also could be an Animated Style.
   * @type AnimateStyle<ViewStyle>
   * @default undefined
   */
  style?: StyleProp<
    AnimateStyle<
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
    >
  >;
  /**
   * View style to be applied to the background component.
   * @type ViewStyle
   * @default undefined
   */
  backgroundStyle?: StyleProp<
    Omit<ViewStyle, 'position' | 'top' | 'left' | 'bottom' | 'right'>
  >;
  /**
   * View style to be applied to the handle component.
   * @type ViewStyle
   * @default undefined
   */
  handleStyle?: StyleProp<ViewStyle>;
  /**
   * View style to be applied to the handle indicator component.
   * @type ViewStyle
   * @default undefined
   */
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  //#endregion

  /**
   * Custom hook to provide pan gesture events handler, which will allow advance and
   * customize handling for pan gesture.
   * @warning this is an experimental feature and the hook signature can change without a major version bump.
   * @type GestureEventsHandlersHookType
   * @default useGestureEventsHandlersDefault
   */
  gestureEventsHandlersHook?: GestureEventsHandlersHookType;

  //#region animated nodes
  /**
   * Animated value to be used as a callback of the position node internally.
   * @type SharedValue<number>
   */
  animatedPosition?: SharedValue<number>;
  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type SharedValue<number>
   */
  animatedIndex?: SharedValue<number>;
  //#endregion

  //#region callbacks
  /**
   * Callback when the sheet position changed to a provided point.
   *
   * @type (index: number) => void;
   */
  onChange?: (index: number, position: number, type: SNAP_POINT_TYPE) => void;
  /**
   * Callback when the sheet close.
   *
   * @type () => void;
   */
  onClose?: () => void;
  /**
   * Callback when the sheet about to animate to a new position.
   *
   * @type (fromIndex: number, toIndex: number, fromPosition: number, toPosition: number) => void;
   */
  onAnimate?: (
    fromIndex: number,
    toIndex: number,
    fromPosition: number,
    toPosition: number
  ) => void;
  //#endregion

  //#region components
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
   * @default undefined
   */
  backdropComponent?: React.FC<BottomSheetBackdropProps>;
  /**
   * Component to be placed as a background.
   * @see {BottomSheetBackgroundProps}
   * @type React.FC\<BottomSheetBackgroundProps\>
   */
  backgroundComponent?: React.FC<BottomSheetBackgroundProps> | null;
  /**
   * Component to be placed as a footer.
   * @see {BottomSheetFooterProps}
   * @type React.FC\<BottomSheetFooterProps\>
   */
  footerComponent?: React.FC<BottomSheetFooterProps>;
  /**
   * A scrollable node or normal view.
   * @type React.ReactNode
   */
  children: React.ReactNode;
  //#endregion

  //#region private
  /**
   * An indicator whether if the sheet running in a modal.
   * @type boolean
   */
  $modal?: boolean;
  //#endregion
}

export interface BottomSheetAnimationConfigs {
  /**
   * Animation configs, this could be created by:
   * - `useBottomSheetSpringConfigs`
   * - `useBottomSheetTimingConfigs`
   * @type WithSpringConfig | WithTimingConfig
   */
  animationConfigs?: WithSpringConfig | WithTimingConfig;
}

export type AnimateToPositionType = (
  position: number,
  source: ANIMATION_SOURCE,
  velocity?: number,
  configs?: WithTimingConfig | WithSpringConfig
) => void;

export type BottomSheetGestureProps = {
  activeOffsetX: Parameters<PanGesture['activeOffsetX']>[0];
  activeOffsetY: Parameters<PanGesture['activeOffsetY']>[0];

  failOffsetY: Parameters<PanGesture['failOffsetY']>[0];
  failOffsetX: Parameters<PanGesture['failOffsetX']>[0];

  simultaneousHandlers: Parameters<
    PanGesture['simultaneousWithExternalGesture']
  >[0];
  waitFor: Parameters<PanGesture['requireExternalGestureToFail']>[0];
};
