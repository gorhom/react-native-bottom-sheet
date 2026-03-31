// @ts-ignore
import type { FlashListProps } from '@shopify/flash-list';
import React, { forwardRef, memo, type Ref, useMemo } from 'react';
import type { ScrollViewProps } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import BottomSheetScrollView from './BottomSheetScrollView';
import type {
  BottomSheetScrollViewMethods,
  BottomSheetScrollableProps,
} from './types';

let FlashList: {
  FlashList: React.FC;
};

try {
  FlashList = require('@shopify/flash-list') as never;
} catch {}

export type BottomSheetFlashListProps<T> = Omit<
  AnimatedProps<FlashListProps<T>>,
  'decelerationRate' | 'onScroll' | 'scrollEventThrottle'
> &
  BottomSheetScrollableProps & {
    ref?: Ref<React.FC>;
  };

const BottomSheetFlashListComponent = forwardRef<
  React.FC,
  BottomSheetFlashListProps<any>
>((props, ref) => {
  const {
    focusHook,
    scrollEventsHandlersHook,
    enableFooterMarginAdjustment,
    ...rest
  }: any = props;

  useMemo(() => {
    if (!FlashList) {
      throw new Error(
        'You need to install FlashList first, `yarn install @shopify/flash-list`'
      );
    }
  }, []);

  const renderScrollComponent = useMemo(
    () =>
      forwardRef<BottomSheetScrollViewMethods, ScrollViewProps>(
        ({ data: _, ...scrollProps }: any, scrollRef) => (
          <BottomSheetScrollView
            ref={scrollRef}
            {...scrollProps}
            focusHook={focusHook}
            scrollEventsHandlersHook={scrollEventsHandlersHook}
            enableFooterMarginAdjustment={enableFooterMarginAdjustment}
          />
        )
      ),
    [enableFooterMarginAdjustment, focusHook, scrollEventsHandlersHook]
  );

  return (
    <FlashList.FlashList
      ref={ref}
      renderScrollComponent={renderScrollComponent}
      {...rest}
    />
  );
});

export const BottomSheetFlashList = memo(BottomSheetFlashListComponent);

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;
