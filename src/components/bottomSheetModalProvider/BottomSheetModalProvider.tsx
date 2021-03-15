import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PortalProvider } from '@gorhom/portal';
import {
  BottomSheetModalProvider,
  BottomSheetModalInternalProvider,
} from '../../contexts';
import BottomSheetContainer from '../bottomSheetContainer';
import { MODAL_STACK_BEHAVIOR, WINDOW_HEIGHT } from '../../constants';
import type { BottomSheetModalStackBehavior } from '../bottomSheetModal';
import type {
  BottomSheetModalProviderProps,
  BottomSheetModalRef,
} from './types';

const BottomSheetModalProviderWrapper = ({
  children,
}: BottomSheetModalProviderProps) => {
  //#region layout state
  const [containerHeight, setContainerHeight] = useState(WINDOW_HEIGHT);
  //#endregion

  //#region variables
  const sheetsQueueRef = useRef<BottomSheetModalRef[]>([]);
  //#endregion

  //#region callback
  const handleOnContainerMeasureHeight = useCallback((height: number) => {
    setContainerHeight(height);
  }, []);
  //#endregion

  //#region private methods
  const handleMountSheet = useCallback(
    (key: string, ref: any, stackBehavior: BottomSheetModalStackBehavior) => {
      const _sheetsQueue = sheetsQueueRef.current.slice();
      const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
      const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

      /**
       * Exit the method, if sheet is already presented
       * and at the top.
       */
      if (sheetIndex !== -1 && sheetOnTop) {
        return;
      }

      /**
       * Minimize the current sheet if:
       * - it exists.
       * - it is not unmounting.
       * - stack behavior is 'replace'.
       */
      const currentMountedSheet = _sheetsQueue[_sheetsQueue.length - 1];
      if (
        currentMountedSheet &&
        !currentMountedSheet.willUnmount &&
        stackBehavior === MODAL_STACK_BEHAVIOR.replace
      ) {
        currentMountedSheet.ref.current.minimize();
      }

      /**
       * Restore and remove incoming sheet from the queue,
       * if it was registered.
       */
      if (sheetIndex !== -1) {
        _sheetsQueue.splice(sheetIndex, 1);
        ref.current.restore();
      }

      _sheetsQueue.push({
        key,
        ref,
        willUnmount: false,
      });
      sheetsQueueRef.current = _sheetsQueue;
    },
    []
  );
  const handleUnmountSheet = useCallback((key: string) => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Here we remove the unmounted sheet and update
     * the sheets queue.
     */
    _sheetsQueue.splice(sheetIndex, 1);
    sheetsQueueRef.current = _sheetsQueue;

    /**
     * Here we try to restore previous sheet position if unmounted
     * sheet was on top. This is needed when user dismiss
     * the modal by panning down.
     */
    const hasMinimizedSheet = sheetsQueueRef.current.length > 0;
    const minimizedSheet =
      sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    if (
      sheetOnTop &&
      hasMinimizedSheet &&
      minimizedSheet &&
      !minimizedSheet.willUnmount
    ) {
      sheetsQueueRef.current[
        sheetsQueueRef.current.length - 1
      ].ref.current.restore();
    }
  }, []);
  const handleWillUnmountSheet = useCallback((key: string) => {
    const _sheetsQueue = sheetsQueueRef.current.slice();
    const sheetIndex = _sheetsQueue.findIndex(item => item.key === key);
    const sheetOnTop = sheetIndex === _sheetsQueue.length - 1;

    /**
     * Here we mark the sheet that will unmount,
     * so it won't be restored.
     */
    if (sheetIndex !== -1) {
      _sheetsQueue[sheetIndex].willUnmount = true;
    }

    /**
     * Here we try to restore previous sheet position,
     * This is needed when user dismiss the modal by fire the dismiss action.
     */
    const hasMinimizedSheet = _sheetsQueue.length > 1;
    if (sheetOnTop && hasMinimizedSheet) {
      _sheetsQueue[_sheetsQueue.length - 2].ref.current.restore();
    }

    sheetsQueueRef.current = _sheetsQueue;
  }, []);
  //#endregion

  //#region public methods
  const handleDismiss = useCallback((key: string) => {
    const sheetToBeDismissed = sheetsQueueRef.current.find(
      item => item.key === key
    );
    if (sheetToBeDismissed) {
      sheetToBeDismissed.ref.current.dismiss(true);
    }
  }, []);
  const handleDismissAll = useCallback(() => {
    sheetsQueueRef.current.map(item => {
      item.ref.current.dismiss(true);
    });
  }, []);
  //#endregion

  //#region context variables
  const externalContextVariables = useMemo(
    () => ({
      dismiss: handleDismiss,
      dismissAll: handleDismissAll,
    }),
    [handleDismiss, handleDismissAll]
  );
  const internalContextVariables = useMemo(
    () => ({
      containerHeight,
      mountSheet: handleMountSheet,
      unmountSheet: handleUnmountSheet,
      willUnmountSheet: handleWillUnmountSheet,
    }),
    [
      containerHeight,
      handleMountSheet,
      handleUnmountSheet,
      handleWillUnmountSheet,
    ]
  );
  //#endregion

  //#region renders
  return (
    <BottomSheetModalProvider value={externalContextVariables}>
      <BottomSheetModalInternalProvider value={internalContextVariables}>
        <BottomSheetContainer
          shouldMeasureHeight={true}
          onMeasureHeight={handleOnContainerMeasureHeight}
          children={null}
        />
        <PortalProvider>{children}</PortalProvider>
      </BottomSheetModalInternalProvider>
    </BottomSheetModalProvider>
  );
  //#endregion
};

export default BottomSheetModalProviderWrapper;
