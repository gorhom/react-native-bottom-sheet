import type React from 'react';
import type {
  AccessibilityProps,
  FlatList,
  Insets,
  KeyboardEventEasing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  SectionList,
} from 'react-native';
import type {
  GestureEventPayload,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import type {
  EasingFunction,
  EasingFunctionFactory,
  ReduceMotion,
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import type {
  ANIMATION_SOURCE,
  ANIMATION_STATUS,
  GESTURE_SOURCE,
  KEYBOARD_STATUS,
  SCROLLABLE_STATUS,
  SCROLLABLE_TYPE,
} from './constants';

//#region Methods
export interface BottomSheetMethods {
  /**
   * Snap to one of the provided points from `snapPoints`.
   * @param index snap point index.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  snapToIndex: (
    index: number,
    animationConfigs?: WithSpringConfig | WithTimingConfig
  ) => void;
  /**
   * Snap to a position out of provided  `snapPoints`.
   * @param position position in pixel or percentage.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  snapToPosition: (
    position: number | string,
    animationConfigs?: WithSpringConfig | WithTimingConfig
  ) => void;
  /**
   * Snap to the maximum provided point from `snapPoints`.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  expand: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
  /**
   * Snap to the minimum provided point from `snapPoints`.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  collapse: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
  /**
   * Close the bottom sheet.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  close: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
  /**
   * Force close the bottom sheet, this prevent any interruptions till the sheet is closed.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  forceClose: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
}

// biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.
export interface BottomSheetModalMethods<T = any> extends BottomSheetMethods {
  /**
   * Mount and present the bottom sheet modal to the initial snap point.
   * @param data to be passed to the modal.
   */
  present: (data?: T) => void;
  /**
   * Close and unmount the bottom sheet modal.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  dismiss: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
}
//#endregion

export interface BottomSheetVariables {
  /**
   * Current sheet position index.
   * @type SharedValue<number>
   */
  animatedIndex: SharedValue<number>;
  /**
   * Current sheet position.
   * @type SharedValue<number>
   */
  animatedPosition: SharedValue<number>;
}

//#region scrollable
export type ScrollableState = {
  type: SCROLLABLE_TYPE;
  contentOffsetY: number;
  refreshable: boolean;
};
export type Scrollable = FlatList | ScrollView | SectionList;
export type ScrollableRef = {
  id: number;
  node: React.RefObject<Scrollable>;
};
export type ScrollableEvent = (
  event: Pick<NativeSyntheticEvent<NativeScrollEvent>, 'nativeEvent'>
) => void;
//#endregion

//#region utils
export interface TimingConfig {
  duration?: number;
  reduceMotion?: ReduceMotion;
  easing?: EasingFunction | EasingFunctionFactory;
}

export type SpringConfig = {
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  reduceMotion?: ReduceMotion;
} & (
  | {
      mass?: number;
      damping?: number;
      duration?: never;
      dampingRatio?: never;
      clamp?: never;
    }
  | {
      mass?: never;
      damping?: never;
      duration?: number;
      dampingRatio?: number;
      clamp?: { min?: number; max?: number };
    }
);

export type Primitive = string | number | boolean;
//#endregion

//#region hooks
export type GestureEventPayloadType = GestureEventPayload &
  PanGestureHandlerEventPayload;

export type GestureEventContextType = {
  didStart?: boolean;
};

export type GestureEventHandlerCallbackType = (
  source: GESTURE_SOURCE,
  payload: GestureEventPayloadType
) => void;

export type GestureEventsHandlersHookType = () => {
  handleOnStart: GestureEventHandlerCallbackType;
  handleOnChange: GestureEventHandlerCallbackType;
  handleOnEnd: GestureEventHandlerCallbackType;
  handleOnFinalize: GestureEventHandlerCallbackType;
};

export type GestureHandlersHookType = (
  source: GESTURE_SOURCE,
  state: SharedValue<State>,
  gestureSource: SharedValue<GESTURE_SOURCE>,
  onStart: GestureEventHandlerCallbackType,
  onChange: GestureEventHandlerCallbackType,
  onEnd: GestureEventHandlerCallbackType,
  onFinalize: GestureEventHandlerCallbackType
) => {
  handleOnStart: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  handleOnChange: (
    event: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >
  ) => void;
  handleOnEnd: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  handleOnFinalize: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
};

type ScrollEventHandlerCallbackType<C = never> = (
  payload: NativeScrollEvent,
  context: C
) => void;

export type ScrollEventsHandlersHookType = (
  ref: React.RefObject<Scrollable>,
  contentOffsetY: SharedValue<number>
) => {
  handleOnScroll?: ScrollEventHandlerCallbackType;
  handleOnBeginDrag?: ScrollEventHandlerCallbackType;
  handleOnEndDrag?: ScrollEventHandlerCallbackType;
  handleOnMomentumBegin?: ScrollEventHandlerCallbackType;
  handleOnMomentumEnd?: ScrollEventHandlerCallbackType;
};
//#endregion

//#region accessibility
export interface NullableAccessibilityProps extends AccessibilityProps {
  accessible?: AccessibilityProps['accessible'] | null;
  accessibilityLabel?: AccessibilityProps['accessibilityLabel'] | null;
  accessibilityHint?: AccessibilityProps['accessibilityHint'] | null;
  accessibilityRole?: AccessibilityProps['accessibilityRole'] | null;
}
//#endregion

//#region states
export type KeyboardState = {
  target?: number;
  status: KEYBOARD_STATUS;
  height: number;
  heightWithinContainer: number;
  easing: KeyboardEventEasing;
  duration: number;
};

/**
 * Represents the state of an animation, including its current status and the source that triggered it.
 */
export type AnimationState = {
  /**
   * The current status of the animation, this can be one of the values defined in the `ANIMATION_STATUS` enum, such as 'idle', 'running', 'completed', etc.
   */
  status: ANIMATION_STATUS;
  /**
   * The source of the animation which indicates where the animation was initiated from, such as user interaction, system event, or programmatic trigger.
   * It is represented by the `ANIMATION_SOURCE` enum, which includes values like 'user', 'system', etc.
   */
  source: ANIMATION_SOURCE;
  /**
   * The index of the next snap point that the animation is targeting.
   */
  nextIndex?: number;
  /**
   * The next position in pixels that the animation is targeting.
   */
  nextPosition?: number;
  /**
   * Indicates whether the animation is forced closing to prevent any interruptions.
   */
  isForcedClosing?: boolean;
};

/**
 * Represents the layout state of the bottom sheet container.
 */
export type ContainerLayoutState = {
  /**
   * The height of the container in pixels.
   */
  height: number;
  /**
   * The required insets applied to the container, such as padding or safe area.
   */
  offset: Required<Insets>;
};

/**
 * Represents the layout state of the bottom sheet components.
 */
export type LayoutState = {
  /**
   * The original height of the container before any adjustments.
   */
  rawContainerHeight: number;
  /**
   * The adjusted height of the container after applying insets or other modifications.
   */
  containerHeight: number;
  /**
   * The required insets applied to the container, such as padding or safe area.
   */
  containerOffset: Required<Insets>;
  /**
   * The height of the handle element used to drag the bottom sheet.
   */
  handleHeight: number;
  /**
   * The height of the footer section within the bottom sheet.
   */
  footerHeight: number;
  /**
   * The total height of the content inside the bottom sheet.
   */
  contentHeight: number;
};

export type DetentsState = {
  detents?: number[];
  dynamicDetentIndex?: number;
  highestDetentPosition?: number;
  closedDetentPosition?: number;
};
//#endregion
