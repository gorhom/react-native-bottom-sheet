// @ts-ignore
import type { FlashListProps } from '@shopify/flash-list';
import React, { forwardRef, memo, type Ref, useMemo } from 'react';
import type { ScrollViewProps } from 'react-native';
import type Animated from 'react-native-reanimated';
import BottomSheetScrollView from './BottomSheetScrollView';
import type {
  BottomSheetScrollViewMethods,
  BottomSheetScrollableProps,
} from './types';

let FlashList: {
  FlashList: React.FC;
};
// since FlashList is not a dependency for the library
// we try to import it using metro optional import
try {
  FlashList = require('@shopify/flash-list') as never;
} catch (_) {}

export type BottomSheetFlashListProps<T> = Omit<
  Animated.AnimateProps<FlashListProps<T>>,
  'decelerationRate' | 'onScroll' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<React.FC>;
  };

const BottomSheetFlashListComponent = forwardRef<
  React.FC,
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

  useMemo(() => {
    if (!FlashList) {
      throw 'You need to install FlashList first, `yarn install @shopify/flash-list`';
    }

    console.warn(
      'BottomSheetFlashList is deprecated, please use useBottomSheetScrollableCreator instead.'
    );
  }, []);

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
    <FlashList.FlashList
      ref={ref}
      renderScrollComponent={renderScrollComponent}
      {...rest}
    />
  );
  //#endregion
});

export const BottomSheetFlashList = memo(BottomSheetFlashListComponent);

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;
