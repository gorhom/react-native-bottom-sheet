import type React from 'react';
import type {
  FlatList,
  ScrollView,
  SectionList,
  NativeScrollEvent,
} from 'react-native';
import type {
  GestureEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import type { GESTURE_SOURCE } from './constants';

//#region Methods
export interface BottomSheetMethods {
  /**
   * Snap to one of the provided points from `snapPoints`.
   * @param index snap point index.
   * @param animationConfigs snap animation configs.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  snapToIndex: (
    index: number,
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
  ) => void;
  /**
   * Snap to a position out of provided  `snapPoints`.
   * @param position position in pixel or percentage.
   * @param animationConfigs snap animation configs.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  snapToPosition: (
    position: number | string,
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
  ) => void;
  /**
   * Snap to the maximum provided point from `snapPoints`.
   * @param animationConfigs snap animation configs.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  expand: (
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
  ) => void;
  /**
   * Snap to the minimum provided point from `snapPoints`.
   * @param animationConfigs snap animation configs.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  collapse: (
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
  ) => void;
  /**
   * Close the bottom sheet.
   * @param animationConfigs snap animation configs.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  close: (
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
  ) => void;
  /**
   * Force close the bottom sheet, this prevent any interruptions till the sheet is closed.
   * @param animationConfigs snap animation configs.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  forceClose: (
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
  ) => void;
}
export interface BottomSheetModalMethods extends BottomSheetMethods {
  /**
   * Mount and present the bottom sheet modal to the initial snap point.
   */
  present: () => void;
  /**
   * Close and unmount the bottom sheet modal.
   * @param animationConfigs snap animation configs.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  dismiss: (
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
  ) => void;
}
//#endregion

export interface BottomSheetVariables {
  /**
   * Current sheet position index.
   * @type Animated.Value<number>
   */
  animatedIndex: Animated.SharedValue<number>;
  /**
   * Current sheet position.
   * @type Animated.Value<number>
   */
  animatedPosition: Animated.SharedValue<number>;
}

//#region scrollables
export type Scrollable = FlatList | ScrollView | SectionList;
export type ScrollableRef = {
  id: number;
  node: React.RefObject<Scrollable>;
};
//#endregion

//#region utils
export type Primitive = string | number | boolean;
export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
//#endregion

//#region hooks
export type GestureEventPayloadType = GestureEventPayload &
  PanGestureHandlerEventPayload;

export type GestureEventContextType = {
  didStart?: boolean;
};

export type GestureEventHandlerCallbackType<C = any> = (
  source: GESTURE_SOURCE,
  payload: GestureEventPayloadType,
  context: C
) => void;

export type GestureEventsHandlersHookType = () => {
  handleOnStart: GestureEventHandlerCallbackType;
  handleOnActive: GestureEventHandlerCallbackType;
  handleOnEnd: GestureEventHandlerCallbackType;
};

type ScrollEventHandlerCallbackType<C = any> = (
  payload: NativeScrollEvent,
  context: C
) => void;

export type ScrollEventsHandlersHookType = (
  ref: React.RefObject<Scrollable>,
  contentOffsetY: Animated.SharedValue<number>
) => {
  handleOnScroll?: ScrollEventHandlerCallbackType;
  handleOnBeginDrag?: ScrollEventHandlerCallbackType;
  handleOnEndDrag?: ScrollEventHandlerCallbackType;
  handleOnMomentumBegin?: ScrollEventHandlerCallbackType;
  handleOnMomentumEnd?: ScrollEventHandlerCallbackType;
};
//#endregion
