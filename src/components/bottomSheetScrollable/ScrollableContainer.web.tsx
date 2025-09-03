import React, {
  type ComponentProps,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import type { LayoutChangeEvent, ViewProps } from 'react-native';
import type { SimultaneousGesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { INITIAL_LAYOUT_VALUE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import { BottomSheetDraggableScrollable } from './BottomSheetDraggableScrollable';

interface ScrollableContainerProps {
  nativeGesture: SimultaneousGesture;
  setContentSize: (contentHeight: number) => void;
  // biome-ignore lint/suspicious/noExplicitAny: 🤷‍♂️
  ScrollableComponent: any;
  onLayout: ViewProps['onLayout'];
}

/**
 * Detect if the current browser is Safari or not.
 */
const isWebkit = () => {
  // @ts-ignore
  return navigator.userAgent.indexOf('Safari') > -1;
};

export const ScrollableContainer = forwardRef<
  never,
  ScrollableContainerProps & { animatedProps: never }
>(function ScrollableContainer(
  {
    nativeGesture,
    ScrollableComponent,
    animatedProps,
    setContentSize,
    onLayout,
    ...rest
  },
  ref
) {
  //#region refs
  const isInitialContentHeightCaptured = useRef(false);
  //#endregion

  //#region hooks
  const { animatedLayoutState } = useBottomSheetInternal();
  //#endregion

  //#region callbacks
  const renderScrollComponent = useCallback(
    (props: ComponentProps<typeof Animated.ScrollView>) => (
      <Animated.ScrollView {...props} animatedProps={animatedProps} />
    ),
    [animatedProps]
  );

  /**
   * A workaround a bug in React Native Web [#1502](https://github.com/necolas/react-native-web/issues/1502),
   * where the `onContentSizeChange` won't be call on initial render.
   */
  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (onLayout) {
        onLayout(event);
      }

      if (!isInitialContentHeightCaptured.current) {
        isInitialContentHeightCaptured.current = true;
        if (!isWebkit()) {
          return;
        }

        /**
         * early exit if the content height been calculated.
         */
        if (animatedLayoutState.get().contentHeight !== INITIAL_LAYOUT_VALUE) {
          return;
        }
        // @ts-ignore
        window.requestAnimationFrame(() => {
          // @ts-ignore
          setContentSize(event.nativeEvent.target.clientHeight);
        });
      }
    },
    [onLayout, setContentSize, animatedLayoutState]
  );
  //#endregion
  return (
    <BottomSheetDraggableScrollable scrollableGesture={nativeGesture}>
      <ScrollableComponent
        ref={ref}
        {...rest}
        onLayout={handleOnLayout}
        renderScrollComponent={renderScrollComponent}
      />
    </BottomSheetDraggableScrollable>
  );
});
