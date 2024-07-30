import React, { useCallback, useMemo, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { PortalProvider } from '@gorhom/portal';
import { BottomSheetModalProvider, BottomSheetModalInternalProvider } from '../../contexts';
import BottomSheetContainer from '../bottomSheetContainer';
import { MODAL_STACK_BEHAVIOR } from '../../constants';
import { INITIAL_CONTAINER_HEIGHT, INITIAL_CONTAINER_OFFSET } from '../bottomSheet/constants';

const BottomSheetModalProviderWrapper = ({
  children
}) => {
  //#region layout variables
  const animatedContainerHeight = useSharedValue(INITIAL_CONTAINER_HEIGHT);
  const animatedContainerOffset = useSharedValue(INITIAL_CONTAINER_OFFSET); //#endregion
  //#region variables

  const sheetsQueueRef = useRef([]); //#endregion
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


    const currentMountedSheet = _sheetsQueue[_sheetsQueue.length - 1];

    if (currentMountedSheet && !currentMountedSheet.willUnmount && stackBehavior === MODAL_STACK_BEHAVIOR.replace) {
      var _currentMountedSheet$, _currentMountedSheet$2;

      (_currentMountedSheet$ = currentMountedSheet.ref) === null || _currentMountedSheet$ === void 0 ? void 0 : (_currentMountedSheet$2 = _currentMountedSheet$.current) === null || _currentMountedSheet$2 === void 0 ? void 0 : _currentMountedSheet$2.minimize();
    }
    /**
     * Restore and remove incoming sheet from the queue,
     * if it was registered.
     */


    if (sheetIndex !== -1) {
      var _ref$current;

      _sheetsQueue.splice(sheetIndex, 1);

      ref === null || ref === void 0 ? void 0 : (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.restore();
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
      var _sheetsQueueRef$curre, _sheetsQueueRef$curre2;

      (_sheetsQueueRef$curre = sheetsQueueRef.current[sheetsQueueRef.current.length - 1].ref) === null || _sheetsQueueRef$curre === void 0 ? void 0 : (_sheetsQueueRef$curre2 = _sheetsQueueRef$curre.current) === null || _sheetsQueueRef$curre2 === void 0 ? void 0 : _sheetsQueueRef$curre2.restore();
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
      var _sheetsQueue$ref, _sheetsQueue$ref$curr;

      (_sheetsQueue$ref = _sheetsQueue[_sheetsQueue.length - 2].ref) === null || _sheetsQueue$ref === void 0 ? void 0 : (_sheetsQueue$ref$curr = _sheetsQueue$ref.current) === null || _sheetsQueue$ref$curr === void 0 ? void 0 : _sheetsQueue$ref$curr.restore();
    }

    sheetsQueueRef.current = _sheetsQueue;
  }, []); //#endregion
  //#region public methods

  const handleDismiss = useCallback(key => {
    const sheetToBeDismissed = key ? sheetsQueueRef.current.find(item => item.key === key) : sheetsQueueRef.current[sheetsQueueRef.current.length - 1];

    if (sheetToBeDismissed) {
      var _sheetToBeDismissed$r, _sheetToBeDismissed$r2;

      (_sheetToBeDismissed$r = sheetToBeDismissed.ref) === null || _sheetToBeDismissed$r === void 0 ? void 0 : (_sheetToBeDismissed$r2 = _sheetToBeDismissed$r.current) === null || _sheetToBeDismissed$r2 === void 0 ? void 0 : _sheetToBeDismissed$r2.dismiss();
      return true;
    }

    return false;
  }, []);
  const handleDismissAll = useCallback(() => {
    sheetsQueueRef.current.map(item => {
      var _item$ref, _item$ref$current;

      (_item$ref = item.ref) === null || _item$ref === void 0 ? void 0 : (_item$ref$current = _item$ref.current) === null || _item$ref$current === void 0 ? void 0 : _item$ref$current.dismiss();
    });
  }, []); //#endregion
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
  }), [animatedContainerHeight, animatedContainerOffset, handleMountSheet, handleUnmountSheet, handleWillUnmountSheet]); //#endregion
  //#region renders

  return /*#__PURE__*/React.createElement(BottomSheetModalProvider, {
    value: externalContextVariables
  }, /*#__PURE__*/React.createElement(BottomSheetModalInternalProvider, {
    value: internalContextVariables
  }, /*#__PURE__*/React.createElement(BottomSheetContainer, {
    containerOffset: animatedContainerOffset,
    containerHeight: animatedContainerHeight,
    children: null
  }), /*#__PURE__*/React.createElement(PortalProvider, null, children))); //#endregion
};

export default BottomSheetModalProviderWrapper;
//# sourceMappingURL=BottomSheetModalProvider.js.map