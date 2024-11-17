import type React from 'react';
import type {
  AccessibilityProps,
  FlatList,
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
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import type { GESTURE_SOURCE } from './constants';

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

//#region scrollables
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

export interface NullableAccessibilityProps extends AccessibilityProps {
  accessible?: AccessibilityProps['accessible'] | null;
  accessibilityLabel?: AccessibilityProps['accessibilityLabel'] | null;
  accessibilityHint?: AccessibilityProps['accessibilityHint'] | null;
  accessibilityRole?: AccessibilityProps['accessibilityRole'] | null;
}
