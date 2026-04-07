import { PortalProvider } from '@gorhom/portal';
import React, { useCallback, useMemo, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import {
  INITIAL_CONTAINER_LAYOUT,
  MODAL_STACK_BEHAVIOR,
} from '../../constants';
import {
  BottomSheetModalInternalProvider,
  BottomSheetModalProvider,
} from '../../contexts';
import type { ContainerLayoutState } from '../../types';
import { id } from '../../utilities/id';
import { BottomSheetHostingContainer } from '../bottomSheetHostingContainer';
import type {
  BottomSheetModalPrivateMethods,
  BottomSheetModalStackBehavior,
} from '../bottomSheetModal';
import type {
  BottomSheetModalProviderProps,
  BottomSheetModalRef,
} from './types';

const BottomSheetModalProviderWrapper = ({
  children,
}: BottomSheetModalProviderProps) => {
  //#region layout variables
  const animatedContainerLayoutState = useSharedValue<ContainerLayoutState>(
    INITIAL_CONTAINER_LAYOUT
  );
  //#endregion

  //#region variables
  const hostName = useMemo(() => `bottom-sheet-portal-${id()}`, []);
  const sheetsQueueRef = useRef<BottomSheetModalRef[]>([]);
  //#endregion

  //#region private methods
  const handleMountSheet = useCallback(
    (
      key: string,
      ref: React.RefObject<BottomSheetModalPrivateMethods>,
      stackBehavior: BottomSheetModalStackBehavior
    ) => {
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

      /**
       * Handle switch or replace stack behaviors, if:
       * - a modal is currently presented.
       * - it is not unmounting
       */
      const currentMountedSheet = _sheetsQueue[_sheetsQueue.length - 1];
      if (currentMountedSheet && !currentMountedSheet.willUnmount) {
        if (stackBehavior === MODAL_STACK_BEHAVIOR.replace) {
          currentMountedSheet.ref?.current?.dismiss();
        } else if (stackBehavior === MODAL_STACK_BEHAVIOR.switch) {
          currentMountedSheet.ref?.current?.minimize();
        }
      }

      /**
       * Restore and remove incoming sheet from the queue,
       * if it was registered.
       */
      if (sheetIndex !== -1) {
        _sheetsQueue.splice(sheetIndex, 1);
        ref?.current?.restore();
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
      ].ref?.current?.restore();
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
      _sheetsQueue[_sheetsQueue.length - 2].ref?.current?.restore();
    }

    sheetsQueueRef.current = _sheetsQueue;
  }, []);
  //#endregion

  //#region public methods
  const handleDismiss = useCallback((key?: string) => {
    const sheetToBeDismissed = key
      ? sheetsQueueRef.current.find(item => item.key === key)
      : sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    if (sheetToBeDismissed) {
      sheetToBeDismissed.ref?.current?.dismiss();
      return true;
    }
    return false;
  }, []);
  const handleDismissAll = useCallback(() => {
    sheetsQueueRef.current.map(item => {
      item.ref?.current?.dismiss();
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
      hostName,
      containerLayoutState: animatedContainerLayoutState,
      mountSheet: handleMountSheet,
      unmountSheet: handleUnmountSheet,
      willUnmountSheet: handleWillUnmountSheet,
    }),
    [
      hostName,
      animatedContainerLayoutState,
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
        <BottomSheetHostingContainer
          containerLayoutState={animatedContainerLayoutState}
        />
        <PortalProvider rootHostName={hostName}>{children}</PortalProvider>
      </BottomSheetModalInternalProvider>
    </BottomSheetModalProvider>
  );
  //#endregion
};

export default BottomSheetModalProviderWrapper;
