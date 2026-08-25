import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { Scrollable, ScrollableEvent } from '../types';
import { workletNoop as noop } from '../utilities';
import { useScrollEventsHandlersDefault } from './useScrollEventsHandlersDefault';

export const useScrollHandler = (
  useScrollEventsHandlers = useScrollEventsHandlersDefault,
  onScroll?: ScrollableEvent,
  onScrollBeginDrag?: ScrollableEvent,
  onScrollEndDrag?: ScrollableEvent
) => {
  // refs
  const scrollableRef = useAnimatedRef<Scrollable>();

  // variables
  const scrollableContentOffsetY = useSharedValue<number>(0);

  // hooks
  const {
    handleOnScroll = noop,
    handleOnBeginDrag = noop,
    handleOnEndDrag = noop,
    handleOnMomentumEnd = noop,
    handleOnMomentumBegin = noop,
  } = useScrollEventsHandlers(scrollableRef, scrollableContentOffsetY);

  // callbacks
  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event, context) => {
        handleOnScroll(event, context);

        if (onScroll) {
          scheduleOnRN(onScroll, { nativeEvent: event });
        }
      },
      onBeginDrag: (event, context) => {
        handleOnBeginDrag(event, context);

        if (onScrollBeginDrag) {
          scheduleOnRN(onScrollBeginDrag, { nativeEvent: event });
        }
      },
      onEndDrag: (event, context) => {
        handleOnEndDrag(event, context);

        if (onScrollEndDrag) {
          scheduleOnRN(onScrollEndDrag, { nativeEvent: event });
        }
      },
      onMomentumBegin: handleOnMomentumBegin,
      onMomentumEnd: handleOnMomentumEnd,
    },
    [
      handleOnScroll,
      handleOnBeginDrag,
      handleOnEndDrag,
      handleOnMomentumBegin,
      handleOnMomentumEnd,
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
    ]
  );

  return { scrollHandler, scrollableRef, scrollableContentOffsetY };
};
