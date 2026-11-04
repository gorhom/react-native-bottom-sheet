import { useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo, Platform, type View } from 'react-native';
import type { BottomSheetModalProps } from '../../components/bottomSheetModal';
import { findNodeHandle } from '../../utilities';

type UseBottomSheetModalAccessibilityParams = Pick<
  BottomSheetModalProps,
  'initialAccessibilityFocusRef' | 'restoreAccessibilityFocusRef'
> & {
  mount: boolean;
  isActive: boolean;
  isPresented: boolean;
};

export function useBottomSheetModalAccessibility({
  mount,
  isActive,
  isPresented,
  initialAccessibilityFocusRef,
  restoreAccessibilityFocusRef,
}: UseBottomSheetModalAccessibilityParams) {
  const accessibilityFocusRef = useRef<View>(null);
  const needsAccessibilityFocusRef = useRef(true);
  const focusOpener = useCallback(() => {
    if (Platform.OS === 'web' || !restoreAccessibilityFocusRef?.current) {
      return;
    }
    const node = findNodeHandle(restoreAccessibilityFocusRef.current);
    if (node !== null) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  }, [restoreAccessibilityFocusRef]);

  useEffect(() => {
    if (!mount || !isActive || !isPresented) {
      needsAccessibilityFocusRef.current = true;
      return;
    }
    if (Platform.OS === 'web' || !needsAccessibilityFocusRef.current) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      const target =
        initialAccessibilityFocusRef?.current ?? accessibilityFocusRef.current;
      if (target) {
        const node = findNodeHandle(target);
        if (node !== null) {
          AccessibilityInfo.setAccessibilityFocus(node);
          needsAccessibilityFocusRef.current = false;
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [mount, isActive, isPresented, initialAccessibilityFocusRef]);

  return { accessibilityFocusRef, focusOpener };
}
