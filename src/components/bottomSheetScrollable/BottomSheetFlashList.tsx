// @ts-ignore
import type { FlashListProps } from '@shopify/flash-list';
import React, { forwardRef, memo, type Ref, useMemo } from 'react';
import { type ScrollViewProps, StyleSheet } from 'react-native';
import type Animated from 'react-native-reanimated';
import BottomSheetScrollView from './BottomSheetScrollView';
import type {
  BottomSheetScrollViewMethods,
  BottomSheetScrollableProps,
} from './types';

let FlashList: React.FC;

try {
  FlashList = require('@shopify/flash-list').FlashList as never;
} catch (_) {
  throw 'You need to install FlashList first, `yarn install @shopify/flash-list`';
}

export type BottomSheetFlashListProps<T> = Omit<
  Animated.AnimateProps<FlashListProps<T>>,
  'decelerationRate' | 'onScroll' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<typeof FlashList>;
  };

const BottomSheetFlashListComponent = forwardRef<
  typeof FlashList,
  // biome-ignore lint/suspicious/noExplicitAny: to be addressed
  BottomSheetFlashListProps<any>
>((props, ref) => {
  //#region props
  const {
    focusHook,
    scrollEventsHandlersHook,
    enableFooterMarginAdjustment,
    ...rest
    // biome-ignore lint: to be addressed!
  }: any = props;
  //#endregion

  //#region render
  const renderScrollComponent = useMemo(
    () =>
      forwardRef<BottomSheetScrollViewMethods, ScrollViewProps>(
        // @ts-ignore
        ({ data, ...props }, ref) => {
          return (
            // @ts-ignore
            <BottomSheetScrollView
              ref={ref}
              {...props}
              focusHook={focusHook}
              scrollEventsHandlersHook={scrollEventsHandlersHook}
              enableFooterMarginAdjustment={enableFooterMarginAdjustment}
            />
          );
        }
      ),
    [focusHook, scrollEventsHandlersHook, enableFooterMarginAdjustment]
  );
  return (
    <FlashList
      ref={ref}
      renderScrollComponent={renderScrollComponent}
      {...rest}
    />
  );
  //#endregion
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
});

export const BottomSheetFlashList = memo(BottomSheetFlashListComponent);

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;
