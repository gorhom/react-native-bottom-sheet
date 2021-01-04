import type { Component, EffectCallback, DependencyList } from 'react';
import type {
  ScrollViewProps as RNScrollViewProps,
  ScrollResponderMixin,
} from 'react-native';

export type BottomSheetScrollViewProps = Omit<
  RNScrollViewProps,
  'decelerationRate' | 'onScrollBeginDrag' | 'scrollEventThrottle'
> & {
  children: React.ReactNode[] | React.ReactNode;
  /**
   * This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with `React Navigation`. You will need to provide `useFocusEffect` from `@react-navigation/native`.
   * @type (effect: EffectCallback, deps?: DependencyList) => void
   */
  focusHook?: (effect: EffectCallback, deps?: DependencyList) => void;
};

type Constructor<T> = new (...args: any[]) => T;

declare class BottomSheetScrollViewComponent extends Component<BottomSheetScrollViewProps> {}
declare const BottomSheetScrollViewBase: Constructor<ScrollResponderMixin> &
  typeof BottomSheetScrollViewComponent;

export class BottomSheetScrollViewType extends BottomSheetScrollViewBase {
  /**
   * Scrolls to a given x, y offset, either immediately or with a smooth animation.
   * Syntax:
   *
   * scrollTo(options: {x: number = 0; y: number = 0; animated: boolean = true})
   *
   * Note: The weird argument signature is due to the fact that, for historical reasons,
   * the function also accepts separate arguments as an alternative to the options object.
   * This is deprecated due to ambiguity (y before x), and SHOULD NOT BE USED.
   */
  scrollTo(
    y?: number | { x?: number; y?: number; animated?: boolean },
    x?: number,
    animated?: boolean
  ): void;

  /**
   * A helper function that scrolls to the end of the scrollview;
   * If this is a vertical ScrollView, it scrolls to the bottom.
   * If this is a horizontal ScrollView scrolls to the right.
   *
   * The options object has an animated prop, that enables the scrolling animation or not.
   * The animated prop defaults to true
   */
  scrollToEnd(options?: { animated: boolean }): void;

  /**
   * Returns a reference to the underlying scroll responder, which supports
   * operations like `scrollTo`. All ScrollView-like components should
   * implement this method so that they can be composed while providing access
   * to the underlying scroll responder's methods.
   */
  getScrollResponder(): JSX.Element;

  getScrollableNode(): any;

  // Undocumented
  getInnerViewNode(): any;

  /**
   * @deprecated Use scrollTo instead
   */
  scrollWithoutAnimationTo?: (y: number, x: number) => void;
}
