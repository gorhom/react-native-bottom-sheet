import { type RefObject, useCallback, useRef, useState } from 'react';
import type { BottomSheetModalRef } from '../../components/bottomSheetModalProvider/types';

export function useBottomSheetModalAccessibilityState(
  sheetsQueueRef: RefObject<BottomSheetModalRef[]>
) {
  const visibleSheetsRef = useRef(new Set<string>());
  const activeSheetKeyRef = useRef<string | null>(null);
  const [activeSheetKey, setActiveSheetKey] = useState<string | null>(null);
  const updateActiveSheet = useCallback(() => {
    const activeSheet = sheetsQueueRef.current
      ?.slice()
      .reverse()
      .find(sheet => visibleSheetsRef.current.has(sheet.key));
    activeSheetKeyRef.current = activeSheet?.key ?? null;
    setActiveSheetKey(activeSheetKeyRef.current);
  }, [sheetsQueueRef]);
  const restoreAccessibilityFocus = useCallback((focus: () => void) => {
    requestAnimationFrame(() => {
      if (activeSheetKeyRef.current === null) {
        focus();
      }
    });
  }, []);
  const setSheetVisible = useCallback(
    (key: string, visible: boolean) => {
      if (visible) {
        visibleSheetsRef.current.add(key);
      } else {
        visibleSheetsRef.current.delete(key);
      }
      updateActiveSheet();
    },
    [updateActiveSheet]
  );

  return { activeSheetKey, setSheetVisible, restoreAccessibilityFocus };
}
