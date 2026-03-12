import type {
  DependencyList,
  EffectCallback,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import type {
  ScrollResponderMixin,
  ScrollViewComponent,
  ScrollViewProps,
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
