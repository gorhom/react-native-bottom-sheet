import type { FlatList, ScrollView, SectionList } from 'react-native';
import type Animated from 'react-native-reanimated';

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
   * @param force prevent any interruptions till sheet is closed.
   *
   * @see {Animated.WithSpringConfig}
   * @see {Animated.WithTimingConfig}
   */
  close: (
    animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig,
    force?: boolean
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
