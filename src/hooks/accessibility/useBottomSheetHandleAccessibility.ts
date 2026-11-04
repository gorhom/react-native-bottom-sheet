import { useCallback, useState } from 'react';
import { type AccessibilityProps, Platform } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import type { BottomSheetProps } from '../../components/bottomSheet';
import type { BottomSheetInternalContextType } from '../../contexts/internal';
import type { BottomSheetMethods } from '../../types';

type UseBottomSheetHandleAccessibilityParams = Pick<
  BottomSheetInternalContextType,
  'animatedIndex' | 'animatedDetentsState'
> &
  Pick<BottomSheetMethods, 'snapToIndex' | 'close'> &
  Pick<BottomSheetProps, 'enablePanDownToClose' | 'onAccessibilityEscape'>;

export function useBottomSheetHandleAccessibility({
  animatedIndex,
  animatedDetentsState,
  snapToIndex,
  close,
  enablePanDownToClose,
  onAccessibilityEscape,
}: UseBottomSheetHandleAccessibilityParams): AccessibilityProps {
  const [position, setPosition] = useState({ index: 0, count: 0 });
  useAnimatedReaction(
    () => ({
      index: Math.round(animatedIndex.value),
      count: animatedDetentsState.value.detents?.length ?? 0,
    }),
    (current, previous) => {
      if (
        current.index !== previous?.index ||
        current.count !== previous?.count
      ) {
        runOnJS(setPosition)(current);
      }
    },
    [animatedIndex, animatedDetentsState]
  );
  const handleAccessibilityAction = useCallback<
    NonNullable<AccessibilityProps['onAccessibilityAction']>
  >(
    ({ nativeEvent: { actionName } }) => {
      const count = animatedDetentsState.value.detents?.length ?? 0;
      if (count === 0) {
        return;
      }
      const index = Math.round(animatedIndex.value);
      const expandAction =
        Platform.OS === 'android' ? 'decrement' : 'increment';
      const collapseAction =
        Platform.OS === 'android' ? 'increment' : 'decrement';
      if (actionName === expandAction && index < count - 1) {
        snapToIndex(Math.max(0, index + 1));
      } else if (actionName === collapseAction) {
        if (index > 0) {
          snapToIndex(index - 1);
        } else if (index === 0 && enablePanDownToClose) {
          close();
        }
      }
    },
    [
      animatedDetentsState,
      animatedIndex,
      snapToIndex,
      close,
      enablePanDownToClose,
    ]
  );

  return {
    accessibilityActions: [{ name: 'increment' }, { name: 'decrement' }],
    onAccessibilityAction: handleAccessibilityAction,
    onAccessibilityEscape:
      onAccessibilityEscape ?? (enablePanDownToClose ? close : undefined),
    accessibilityValue: {
      min: 1,
      max: Math.max(1, position.count),
      now: Math.max(1, Math.min(position.count, position.index + 1)),
    },
  };
}
