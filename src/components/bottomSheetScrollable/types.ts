import type {
  DependencyList,
  EffectCallback,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import type {
  FlatListProps,
  NodeHandle,
  ScrollResponderMixin,
  ScrollViewComponent,
  ScrollViewProps,
  SectionListProps,
  SectionListScrollParams,
  VirtualizedListProps,
  View,
} from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
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

export type BottomSheetFlatListProps<T> = Omit<
  AnimatedProps<FlatListProps<T>>,
  'decelerationRate' | 'onScroll' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetFlatListMethods>;
  };

export interface BottomSheetFlatListMethods {
  scrollToEnd: (params?: { animated?: boolean | null }) => void;
  scrollToIndex: (params: {
    animated?: boolean | null;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;
  scrollToItem: (params: {
    animated?: boolean | null;
    item: any;
    viewPosition?: number;
  }) => void;
  scrollToOffset: (params: {
    animated?: boolean | null;
    offset: number;
  }) => void;
  recordInteraction: () => void;
  flashScrollIndicators: () => void;
  getScrollResponder: () => ScrollResponderMixin | null | undefined;
  getNativeScrollRef: () =>
    | RefObject<View>
    | RefObject<ScrollViewComponent>
    | null
    | undefined;
  getScrollableNode: () => any;
  setNativeProps: (props: { [key: string]: any }) => void;
}

export type BottomSheetScrollViewProps = Omit<
  AnimatedProps<ScrollViewProps>,
  'decelerationRate' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetScrollViewMethods>;
    children?: ReactNode | ReactNode[];
  };

export interface BottomSheetScrollViewMethods {
  scrollTo(
    y?: number | { x?: number; y?: number; animated?: boolean },
    x?: number,
    animated?: boolean
  ): void;

  scrollToEnd(options?: { animated: boolean }): void;

  getScrollResponder(): ScrollResponderMixin;

  // biome-ignore lint: to be addressed!
  getScrollableNode(): any;

  // biome-ignore lint: to be addressed!
  getInnerViewNode(): any;

  scrollWithoutAnimationTo?: (y: number, x: number) => void;

  setNativeProps(nativeProps: object): void;

  getNativeScrollRef?: () =>
    | RefObject<View>
    | RefObject<ScrollViewComponent>
    | null
    | undefined;
}

export type BottomSheetSectionListProps<ItemT, SectionT> = Omit<
  AnimatedProps<SectionListProps<ItemT, SectionT>>,
  'decelerationRate' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<BottomSheetSectionListMethods>;
  };

export interface BottomSheetSectionListMethods {
  scrollToLocation(params: SectionListScrollParams): void;
  recordInteraction(): void;
  flashScrollIndicators(): void;
  getScrollResponder(): ScrollResponderMixin | undefined;
  getScrollableNode(): NodeHandle | undefined;
}

export type BottomSheetVirtualizedListProps<T> = Omit<
  AnimatedProps<VirtualizedListProps<T>>,
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
  scrollToOffset: (params: { animated?: boolean; offset: number }) => void;
  recordInteraction: () => void;
}
