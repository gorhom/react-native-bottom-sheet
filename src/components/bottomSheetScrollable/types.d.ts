import type {
  DependencyList,
  EffectCallback,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import type {
  VirtualizedListProps,
  ScrollViewProps,
  FlatListProps,
  SectionListProps,
  SectionListScrollParams,
  View,
  ScrollViewComponent,
  NodeHandle,
  ScrollResponderMixin,
} from 'react-native';
import type Animated from 'react-native-reanimated';
import type { ScrollEventsHandlersHookType } from '../../types';

export interface BottomSheetScrollableProps {
  /**
   * Adjust the scrollable bottom margin to avoid the animated footer.
   *
   * @type boolean
   * @default false
   */
  enableFooterMarginAdjustment?: boolean;

  /**
   * This needed when bottom sheet used with multiple scrollables to allow bottom sheet
   * detect the current scrollable ref, especially when used with `React Navigation`.
   * You will need to provide `useFocusEffect` from `@react-navigation/native`.
   *
   * @type (effect: EffectCallback, deps?: DependencyList) => void
   * @default useEffect
   */
  focusHook?: (effect: EffectCallback, deps?: DependencyList) => void;

  /**
   * Custom hook to provide scroll events handler, which will allow advance and
   * customize handling for scrollables.
   *
   * @warning this is an experimental feature and the hook signature can change without a major version bump.
   * @type ScrollEventsHandlersHookType
   * @default useScrollEventsHandlersDefault
   */
  scrollEventsHandlersHook?: ScrollEventsHandlersHookType;
}

export type ScrollableProps<T> =
  | ScrollViewProps
  | FlatListProps<T>
  | SectionListProps<T>;

//#region FlatList
export type BottomSheetFlatListProps<T> = Omit<
  Animated.AnimateProps<FlatListProps<T>>,
  'decelerationRate' | 'onScroll' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetFlatListMethods>;
  };

export interface BottomSheetFlatListMethods {
  /**
   * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
   */
  scrollToEnd: (params?: { animated?: boolean | null }) => void;

  /**
   * Scrolls to the item at the specified index such that it is positioned in the viewable area
   * such that viewPosition 0 places it at the top, 1 at the bottom, and 0.5 centered in the middle.
   * Cannot scroll to locations outside the render window without specifying the getItemLayout prop.
   */
  scrollToIndex: (params: {
    animated?: boolean | null;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;

  /**
   * Requires linear scan through data - use `scrollToIndex` instead if possible.
   * May be janky without `getItemLayout` prop.
   */
  scrollToItem: (params: {
    animated?: boolean | null;
    item: any;
    viewPosition?: number;
  }) => void;

  /**
   * Scroll to a specific content pixel offset, like a normal `ScrollView`.
   */
  scrollToOffset: (params: {
    animated?: boolean | null;
    offset: number;
  }) => void;

  /**
   * Tells the list an interaction has occured, which should trigger viewability calculations,
   * e.g. if waitForInteractions is true and the user has not scrolled. This is typically called
   * by taps on items or by navigation actions.
   */
  recordInteraction: () => void;

  /**
   * Displays the scroll indicators momentarily.
   */
  flashScrollIndicators: () => void;

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder: () => ScrollResponderMixin | null | undefined;

  /**
   * Provides a reference to the underlying host component
   */
  getNativeScrollRef: () =>
    | RefObject<View>
    | RefObject<ScrollViewComponent>
    | null
    | undefined;

  getScrollableNode: () => any;

  // TODO: use `unknown` instead of `any` for Typescript >= 3.0
  setNativeProps: (props: { [key: string]: any }) => void;
}
//#endregion

//#region ScrollView
export type BottomSheetScrollViewProps = Omit<
  Animated.AnimateProps<ScrollViewProps>,
  'decelerationRate' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetScrollViewMethods>;
    children: ReactNode | ReactNode[];
  };

export interface BottomSheetScrollViewMethods {
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
  getScrollResponder(): ScrollResponderMixin;

  getScrollableNode(): any;

  // Undocumented
  getInnerViewNode(): any;

  /**
   * @deprecated Use scrollTo instead
   */
  scrollWithoutAnimationTo?: (y: number, x: number) => void;

  /**
   * This function sends props straight to native. They will not participate in
   * future diff process - this means that if you do not include them in the
   * next render, they will remain active (see [Direct
   * Manipulation](https://reactnative.dev/docs/direct-manipulation)).
   */
  setNativeProps(nativeProps: object): void;
}
//#endregion

//#region SectionList
type BottomSheetSectionListProps<ItemT, SectionT> = Omit<
  Animated.AnimateProps<SectionListProps<ItemT, SectionT>>,
  'decelerationRate' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetSectionListMethods>;
  };

export interface BottomSheetSectionListMethods {
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
  getScrollResponder(): ScrollResponderMixin | undefined;

  /**
   * Provides a handle to the underlying scroll node.
   */
  getScrollableNode(): NodeHandle | undefined;
}
//#endregion

//#region
export type BottomSheetVirtualizedListProps<T> = Omit<
  Animated.AnimateProps<VirtualizedListProps<T>>,
  'decelerationRate' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetVirtualizedListMethods>;
  };

export interface BottomSheetVirtualizedListMethods {
  scrollToEnd: (params?: { animated?: boolean }) => void;
  scrollToIndex: (params: {
    animated?: boolean;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;
  scrollToItem: (params: {
    animated?: boolean;
    item: any;
    viewPosition?: number;
  }) => void;

  /**
   * Scroll to a specific content pixel offset in the list.
   * Param `offset` expects the offset to scroll to. In case of horizontal is true, the
   * offset is the x-value, in any other case the offset is the y-value.
   * Param `animated` (true by default) defines whether the list should do an animation while scrolling.
   */
  scrollToOffset: (params: { animated?: boolean; offset: number }) => void;

  recordInteraction: () => void;
}
//#endregion
