import type { FlatList, ScrollView, SectionList } from 'react-native';
import type Animated from 'react-native-reanimated';

//#region Methods
export interface BottomSheetMethods {
  /**
   * Snap to one of the provided points from `snapPoints`.
   * @param index snap point index.
   * @param animationDuration snap animation duration.
   * @param animationEasing snap animation easing function.
   * @type (index: number) => void
   */
  snapTo: (
    index: number,
    animationDuration?: number,
    animationEasing?: Animated.EasingFunction
  ) => void;
  /**
   * Snap to the maximum provided point from `snapPoints`.
   * @param animationDuration snap animation duration.
   * @param animationEasing snap animation easing function.
   * @type () => void
   */
  expand: (
    animationDuration?: number,
    animationEasing?: Animated.EasingFunction
  ) => void;
  /**
   * Snap to the minimum provided point from `snapPoints`.
   * @param animationDuration snap animation duration.
   * @param animationEasing snap animation easing function.
   * @type () => void
   */
  collapse: (
    animationDuration?: number,
    animationEasing?: Animated.EasingFunction
  ) => void;
  /**
   * Close the bottom sheet.
   * @param animationDuration snap animation duration.
   * @param animationEasing snap animation easing function.
   * @type () => void
   */
  close: (
    animationDuration?: number,
    animationEasing?: Animated.EasingFunction
  ) => void;
}

export interface BottomSheetModalMethods extends BottomSheetMethods {
  /**
   * Mount and present the modal.
   * @type () => void
   */
  present: () => void;
  /**
   * Close and unmount the modal.
   * @param animationDuration snap animation duration.
   * @param animationEasing snap animation easing function.
   * @type () => void;
   */
  dismiss: (
    animationDuration?: number,
    animationEasing?: Animated.EasingFunction
  ) => void;
}
//#endregion

//#region scrollables
export type Scrollable = FlatList | ScrollView | SectionList;

export type ScrollableType = 'FlatList' | 'ScrollView' | 'SectionList' | 'View';

export type ScrollableRef = {
  id: number;
  node: React.RefObject<Scrollable>;
  type: ScrollableType;
  didResize: boolean;
};
//#endregion
