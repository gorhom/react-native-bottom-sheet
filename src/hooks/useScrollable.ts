import { type RefObject, useCallback, useRef } from 'react';
import type { NodeHandle } from 'react-native';
import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {
  ANIMATION_STATUS,
  KEYBOARD_STATUS,
  SCROLLABLE_STATUS,
  SCROLLABLE_TYPE,
  SHEET_STATE,
} from '../constants';
import type {
  AnimationState,
  KeyboardState,
  Scrollable,
  ScrollableRef,
  ScrollableState,
} from '../types';
import { findNodeHandle } from '../utilities';

export const useScrollable = (
  enableContentPanningGesture: boolean,
  animatedSheetState: SharedValue<SHEET_STATE>,
  animatedKeyboardState: SharedValue<KeyboardState>,
  animatedAnimationState: SharedValue<AnimationState>
) => {
  //#region refs
  const scrollableRef = useRef<ScrollableRef>(null);
  const previousScrollableRef = useRef<ScrollableRef>(null);
  //#endregion

  //#region variables
  const state = useSharedValue<ScrollableState>({
    type: SCROLLABLE_TYPE.UNDETERMINED,
    contentOffsetY: 0,
    refreshable: false,
  });
  const status = useDerivedValue<SCROLLABLE_STATUS>(() => {
    /**
     * if user had disabled content panning gesture, then we unlock
     * the scrollable state.
     */
    if (!enableContentPanningGesture) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if sheet state is fill parent, then unlock scrolling
     */
    if (animatedSheetState.value === SHEET_STATE.FILL_PARENT) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if sheet state is extended, then unlock scrolling
     */
    if (animatedSheetState.value === SHEET_STATE.EXTENDED) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }

    /**
     * if keyboard is shown and sheet is animating
     * then we do not lock the scrolling to not lose
     * current scrollable scroll position.
     */
    if (
      animatedKeyboardState.get().status === KEYBOARD_STATUS.SHOWN &&
      animatedAnimationState.get().status === ANIMATION_STATUS.RUNNING
    ) {
      return SCROLLABLE_STATUS.UNLOCKED;
    }

    return SCROLLABLE_STATUS.LOCKED;
  }, [
    enableContentPanningGesture,
    animatedSheetState,
    animatedKeyboardState,
    animatedAnimationState,
    state,
  ]);
  //#endregion

  //#region callbacks
  const setScrollableRef = useCallback((ref: ScrollableRef) => {
    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;

    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      }
      // @ts-ignore
      scrollableRef.current = ref;
    }
  }, []);

  const removeScrollableRef = useCallback((ref: RefObject<Scrollable>) => {
    // find node handle id
    let id: NodeHandle | null;
    try {
      id = findNodeHandle(ref.current);
    } catch {
      return;
    }

    // get current node handle id
    const currentRefId = scrollableRef.current?.id ?? null;

    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */
    if (id === currentRefId) {
      // @ts-ignore
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);
  //#endregion

  return {
    state,
    status,
    setScrollableRef,
    removeScrollableRef,
  };
};
