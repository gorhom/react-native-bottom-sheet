import type { Component, EffectCallback, DependencyList } from 'react';
import type { SectionListProps as RNSectionListProps } from 'react-native';

type BottomSheetSectionListProps<T> = Omit<
  RNSectionListProps<T>,
  'decelerationRate' | 'onScrollBeginDrag' | 'scrollEventThrottle'
> & {
  /**
   * This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with `React Navigation`. You will need to provide `useFocusEffect` from `@react-navigation/native`.
   * @type (effect: EffectCallback, deps?: DependencyList) => void
   */
  focusHook?: (effect: EffectCallback, deps?: DependencyList) => void;
};

export class BottomSheetSectionListType<T = any> extends Component<
  BottomSheetSectionListProps<T>
> {
  /**
   * Scrolls to the item at the specified sectionIndex and itemIndex (within the section)
   * positioned in the viewable area such that viewPosition 0 places it at the top
   * (and may be covered by a sticky header), 1 at the bottom, and 0.5 centered in the middle.
   */
  scrollToLocation(params: SectionListScrollParams): void;

  /**
   * Tells the list an interaction has occurred, which should trigger viewability calculations, e.g.
   * if `waitForInteractions` is true and the user has not scrolled. This is typically called by
   * taps on items or by navigation actions.
   */
  recordInteraction(): void;

  /**
   * Displays the scroll indicators momentarily.
   *
   * @platform ios
   */
  flashScrollIndicators(): void;

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder(): ScrollView | undefined;

  /**
   * Provides a handle to the underlying scroll node.
   */
  getScrollableNode(): NodeHandle | undefined;
}
