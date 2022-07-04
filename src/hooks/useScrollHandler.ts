import {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useScrollEventsHandlersDefault } from './useScrollEventsHandlersDefault';
import { workletNoop as noop } from '../utilities';
import type { Scrollable, ScrollableEvent } from '../types';

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
          runOnJS(onScroll)({ nativeEvent: event });
        }
      },
      onBeginDrag: (event, context) => {
        handleOnBeginDrag(event, context);

        if (onScrollBeginDrag) {
          runOnJS(onScrollBeginDrag)({ nativeEvent: event });
        }
      },
      onEndDrag: (event, context) => {
        handleOnEndDrag(event, context);

        if (onScrollEndDrag) {
          runOnJS(onScrollEndDrag)({ nativeEvent: event });
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
