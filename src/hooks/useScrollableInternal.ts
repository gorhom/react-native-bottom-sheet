import { useCallback } from 'react';
import { findNodeHandle, NativeScrollEvent } from 'react-native';
import {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
  runOnUI,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import type { Scrollable } from '../types';
import {
  ANIMATION_STATE,
  SCROLLABLE_DECELERATION_RATE_MAPPER,
  SCROLLABLE_STATE,
  SHEET_STATE,
} from '../constants';

type HandleScrollEventContextType = {
  initialContentOffsetY: number;
  shouldLockInitialPosition: boolean;
};

export const useScrollableInternal = () => {
  // refs
  const scrollableRef = useAnimatedRef<Scrollable>();
  const scrollableContentOffsetY = useSharedValue<number>(0);

  // hooks
  const {
    animatedSheetState,
    animatedScrollableState,
    animatedAnimationState,
    scrollableContentOffsetY: _rootScrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // variables
  const scrollableAnimatedProps = useAnimatedProps(() => ({
    decelerationRate:
      SCROLLABLE_DECELERATION_RATE_MAPPER[animatedScrollableState.value],
  }));

  // callbacks
  const handleScrollEvent =
    useAnimatedScrollHandler<HandleScrollEventContextType>({
      onBeginDrag: ({ contentOffset: { y } }: NativeScrollEvent, context) => {
        scrollableContentOffsetY.value = y;
        _rootScrollableContentOffsetY.value = y;
        context.initialContentOffsetY = y;

        /**
         * if sheet position not extended or fill parent and the scrollable position
         * not at the top, then we should lock the initial scrollable position.
         */
        if (
          animatedSheetState.value !== SHEET_STATE.EXTENDED &&
          animatedSheetState.value !== SHEET_STATE.FILL_PARENT &&
          y > 0
        ) {
          context.shouldLockInitialPosition = true;
        } else {
          context.shouldLockInitialPosition = false;
        }
      },
      onScroll: (_, context) => {
        /**
         * if sheet position is extended or fill parent, then we reset
         * `shouldLockInitialPosition` value to false.
         */
        if (
          animatedSheetState.value === SHEET_STATE.EXTENDED ||
          animatedSheetState.value === SHEET_STATE.FILL_PARENT
        ) {
          context.shouldLockInitialPosition = false;
        }

        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          const lockPosition = context.shouldLockInitialPosition
            ? context.initialContentOffsetY ?? 0
            : 0;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = lockPosition;
          return;
        }
      },
      onEndDrag: ({ contentOffset: { y } }: NativeScrollEvent, context) => {
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          const lockPosition = context.shouldLockInitialPosition
            ? context.initialContentOffsetY ?? 0
            : 0;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = lockPosition;
          return;
        }
        if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
          scrollableContentOffsetY.value = y;
          _rootScrollableContentOffsetY.value = y;
        }
      },
      onMomentumEnd: ({ contentOffset: { y } }: NativeScrollEvent, context) => {
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          const lockPosition = context.shouldLockInitialPosition
            ? context.initialContentOffsetY ?? 0
            : 0;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          scrollableContentOffsetY.value = lockPosition;
          scrollableContentOffsetY.value = 0;
          return;
        }
        if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
          scrollableContentOffsetY.value = y;
          _rootScrollableContentOffsetY.value = y;
        }
      },
    });
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    runOnUI(() => {
      _rootScrollableContentOffsetY.value = scrollableContentOffsetY.value;
    })();

    // set current scrollable ref
    const id = findNodeHandle(scrollableRef.current);
    if (id) {
      setScrollableRef({
        id: id,
        node: scrollableRef,
        didResize: false,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(scrollableRef);
    };
  }, [
    _rootScrollableContentOffsetY,
    removeScrollableRef,
    scrollableContentOffsetY,
    scrollableRef,
    setScrollableRef,
  ]);

  return {
    scrollableRef,
    scrollableAnimatedProps,
    handleScrollEvent,
    handleSettingScrollable,
  };
};
