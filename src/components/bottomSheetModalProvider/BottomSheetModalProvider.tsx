import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PortalHost } from '@gorhom/portal';
import {
  BottomSheetModalProvider,
  BottomSheetModalInternalProvider,
} from '../../contexts';
import BottomSheetContainer from '../bottomSheetContainer';
import { WINDOW_HEIGHT } from '../../constants';
import type {
  BottomSheetModalProviderProps,
  BottomSheetModalRef,
} from './types';

const BottomSheetModalProviderWrapper = (
  props: BottomSheetModalProviderProps
) => {
  // extract props
  const { children } = props;

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
  const handleMountSheet = useCallback((key: string, ref) => {
    console.log(
      'mount',
      key,
      sheetsQueueRef.current.map(item => item.key)
    );
    /**
     * Here we try to minimize the current sheet if exists,
     * also we make sure that it is not incoming mounted sheet.
     */
    const mountedSheet =
      sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    if (mountedSheet && mountedSheet.key !== key && !mountedSheet.willUnmount) {
      sheetsQueueRef.current[
        sheetsQueueRef.current.length - 1
      ].ref.current.minimize();
    }

    /**
     * We check if the incoming sheet is already mounted.
     */
    const isIncomingSheetMounted =
      sheetsQueueRef.current.find(item => item.key === key) !== undefined;

    if (isIncomingSheetMounted) {
      /**
       * We move the mounted incoming sheet to the
       * end of the queue.
       */
      const newSheetsQueue = sheetsQueueRef.current.filter(
        item => item.key !== key
      );
      newSheetsQueue.push({
        key,
        ref,
        willUnmount: false,
      });
      sheetsQueueRef.current = newSheetsQueue;

      ref.current.restore();
    } else {
      /**
       * We add the incoming sheet to the end of the queue.
       */
      sheetsQueueRef.current.push({
        key,
        ref,
        willUnmount: false,
      });
    }
  }, []);
  const handleUnmountSheet = useCallback((key: string) => {
    console.log(
      'unmount',
      key,
      sheetsQueueRef.current.map(item => item.key)
    );
    /**
     * Here we remove the unmounted sheet and update
     * the sheets queue.
     */
    const newSheetsQueue = sheetsQueueRef.current.filter(
      item => item.key !== key
    );
    sheetsQueueRef.current = newSheetsQueue;

    /**
     * Here we try to restore previous sheet position,
     * This is needed when user dismiss the modal by panning down.
     */
    const hasMinimizedSheet = sheetsQueueRef.current.length > 0;
    if (hasMinimizedSheet) {
      sheetsQueueRef.current[
        sheetsQueueRef.current.length - 1
      ].ref.current.restore();
    }
  }, []);
  const handleWillUnmountSheet = useCallback((key: string) => {
    /**
     * Here we mark the sheet that will unmount,
     * so it won't be restored.
     */
    const sheetToBeUnmount = sheetsQueueRef.current.find(
      item => item.key === key
    );
    if (sheetToBeUnmount) {
      sheetToBeUnmount.willUnmount = true;
    }

    /**
     * Here we try to restore previous sheet position,
     * This is needed when user dismiss the modal by fire the dismiss action.
     */
    const hasMinimizedSheet = sheetsQueueRef.current.length > 1;
    if (hasMinimizedSheet) {
      sheetsQueueRef.current[
        sheetsQueueRef.current.length - 2
      ].ref.current.restore();
    }
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
        <PortalHost>{children}</PortalHost>
      </BottomSheetModalInternalProvider>
    </BottomSheetModalProvider>
  );
  //#endregion
};

export default BottomSheetModalProviderWrapper;
