"use strict";

import { PortalProvider } from '@gorhom/portal';
import React, { useCallback, useMemo, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { MODAL_STACK_BEHAVIOR } from '../../constants';
import { BottomSheetModalInternalProvider, BottomSheetModalProvider } from '../../contexts';
import { INITIAL_CONTAINER_HEIGHT, INITIAL_CONTAINER_OFFSET } from '../bottomSheet/constants';
import BottomSheetContainer from '../bottomSheetContainer';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BottomSheetModalProviderWrapper = ({
  children
}) => {
  //#region layout variables
  const animatedContainerHeight = useSharedValue(INITIAL_CONTAINER_HEIGHT);
  const animatedContainerOffset = useSharedValue(INITIAL_CONTAINER_OFFSET);
  //#endregion

  //#region variables
  const sheetsQueueRef = useRef([]);
  //#endregion

  //#region private methods
  const handleMountSheet = useCallback((key, ref, stackBehavior) => {
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
      willUnmount: false
    });
    sheetsQueueRef.current = _sheetsQueue;
  }, []);
  const handleUnmountSheet = useCallback(key => {
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
    const minimizedSheet = sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
    if (sheetOnTop && hasMinimizedSheet && minimizedSheet && !minimizedSheet.willUnmount) {
      sheetsQueueRef.current[sheetsQueueRef.current.length - 1].ref?.current?.restore();
    }
  }, []);
  const handleWillUnmountSheet = useCallback(key => {
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
  const handleDismiss = useCallback(key => {
    const sheetToBeDismissed = key ? sheetsQueueRef.current.find(item => item.key === key) : sheetsQueueRef.current[sheetsQueueRef.current.length - 1];
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
  const externalContextVariables = useMemo(() => ({
    dismiss: handleDismiss,
    dismissAll: handleDismissAll
  }), [handleDismiss, handleDismissAll]);
  const internalContextVariables = useMemo(() => ({
    containerHeight: animatedContainerHeight,
    containerOffset: animatedContainerOffset,
    mountSheet: handleMountSheet,
    unmountSheet: handleUnmountSheet,
    willUnmountSheet: handleWillUnmountSheet
  }), [animatedContainerHeight, animatedContainerOffset, handleMountSheet, handleUnmountSheet, handleWillUnmountSheet]);
  //#endregion

  //#region renders
  return /*#__PURE__*/_jsx(BottomSheetModalProvider, {
    value: externalContextVariables,
    children: /*#__PURE__*/_jsxs(BottomSheetModalInternalProvider, {
      value: internalContextVariables,
      children: [/*#__PURE__*/_jsx(BottomSheetContainer, {
        containerOffset: animatedContainerOffset,
        containerHeight: animatedContainerHeight
      }), /*#__PURE__*/_jsx(PortalProvider, {
        children: children
      })]
    })
  });
  //#endregion
};
export default BottomSheetModalProviderWrapper;
//# sourceMappingURL=BottomSheetModalProvider.js.map