import { useState } from 'react';
import type { AccessibilityProps } from 'react-native';
import {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';

export function useBottomSheetAccessibilityVisibility(
  animatedIndex: SharedValue<number>
): AccessibilityProps {
  const [isHidden, setIsHidden] = useState(animatedIndex.value <= -1);
  useAnimatedReaction(
    () => animatedIndex.value <= -1,
    (hidden, previous) => {
      if (hidden !== previous) {
        runOnJS(setIsHidden)(hidden);
      }
    },
    [animatedIndex]
  );

  return {
    accessibilityElementsHidden: isHidden,
    importantForAccessibility: isHidden ? 'no-hide-descendants' : 'auto',
  };
}
