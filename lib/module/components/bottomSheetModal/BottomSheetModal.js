function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Portal, usePortal } from '@gorhom/portal';
import BottomSheet from '../bottomSheet';
import { useBottomSheetModalInternal } from '../../hooks';
import { print } from '../../utilities';
import { DEFAULT_STACK_BEHAVIOR, DEFAULT_ENABLE_DISMISS_ON_CLOSE } from './constants';
import { id } from '../../utilities/id';
const INITIAL_STATE = {
  mount: false,
  data: undefined
};
const BottomSheetModalComponent = /*#__PURE__*/forwardRef(function BottomSheetModal(props, ref) {
  const {
    // modal props
    name,
    stackBehavior = DEFAULT_STACK_BEHAVIOR,
    enableDismissOnClose = DEFAULT_ENABLE_DISMISS_ON_CLOSE,
    onDismiss: _providedOnDismiss,
    // bottom sheet props
    index = 0,
    snapPoints,
    enablePanDownToClose = true,
    animateOnMount = true,
    containerComponent: ContainerComponent = React.Fragment,
    // callbacks
    onChange: _providedOnChange,
    // components
    children: Content,
    ...bottomSheetProps
  } = props; //#region state

  const [{
    mount,
    data
  }, setState] = useState(INITIAL_STATE); //#endregion
  //#region hooks

  const {
    containerHeight,
    containerOffset,
    mountSheet,
    unmountSheet,
    willUnmountSheet
  } = useBottomSheetModalInternal();
  const {
    removePortal: unmountPortal
  } = usePortal(); //#endregion
  //#region refs

  const bottomSheetRef = useRef(null);
  const currentIndexRef = useRef(!animateOnMount ? index : -1);
  const restoreIndexRef = useRef(-1);
  const minimized = useRef(false);
  const forcedDismissed = useRef(false);
  const mounted = useRef(false);
  mounted.current = mount; //#endregion
  //#region variables

  const key = useMemo(() => name || `bottom-sheet-modal-${id()}`, [name]); //#endregion
  //#region private methods

  const resetVariables = useCallback(function resetVariables() {
    print({
      component: BottomSheetModal.name,
      method: resetVariables.name
    });
    currentIndexRef.current = -1;
    restoreIndexRef.current = -1;
    minimized.current = false;
    mounted.current = false;
    forcedDismissed.current = false;
  }, []);
  const unmount = useCallback(function unmount() {
    print({
      component: BottomSheetModal.name,
      method: unmount.name
    });
    const _mounted = mounted.current; // reset variables

    resetVariables(); // unmount sheet and portal

    unmountSheet(key);
    unmountPortal(key); // unmount the node, if sheet is still mounted

    if (_mounted) {
      setState(INITIAL_STATE);
    } // fire `onDismiss` callback


    if (_providedOnDismiss) {
      _providedOnDismiss();
    }
  }, [key, resetVariables, unmountSheet, unmountPortal, _providedOnDismiss]); //#endregion
  //#region bottom sheet methods

  const handleSnapToIndex = useCallback((...args) => {
    var _bottomSheetRef$curre;

    if (minimized.current) {
      return;
    }

    (_bottomSheetRef$curre = bottomSheetRef.current) === null || _bottomSheetRef$curre === void 0 ? void 0 : _bottomSheetRef$curre.snapToIndex(...args);
  }, []);
  const handleSnapToPosition = useCallback((...args) => {
    var _bottomSheetRef$curre2;

    if (minimized.current) {
      return;
    }

    (_bottomSheetRef$curre2 = bottomSheetRef.current) === null || _bottomSheetRef$curre2 === void 0 ? void 0 : _bottomSheetRef$curre2.snapToPosition(...args);
  }, []);
  const handleExpand = useCallback((...args) => {
    var _bottomSheetRef$curre3;

    if (minimized.current) {
      return;
    }

    (_bottomSheetRef$curre3 = bottomSheetRef.current) === null || _bottomSheetRef$curre3 === void 0 ? void 0 : _bottomSheetRef$curre3.expand(...args);
  }, []);
  const handleCollapse = useCallback((...args) => {
    var _bottomSheetRef$curre4;

    if (minimized.current) {
      return;
    }

    (_bottomSheetRef$curre4 = bottomSheetRef.current) === null || _bottomSheetRef$curre4 === void 0 ? void 0 : _bottomSheetRef$curre4.collapse(...args);
  }, []);
  const handleClose = useCallback((...args) => {
    var _bottomSheetRef$curre5;

    if (minimized.current) {
      return;
    }

    (_bottomSheetRef$curre5 = bottomSheetRef.current) === null || _bottomSheetRef$curre5 === void 0 ? void 0 : _bottomSheetRef$curre5.close(...args);
  }, []);
  const handleForceClose = useCallback((...args) => {
    var _bottomSheetRef$curre6;

    if (minimized.current) {
      return;
    }

    (_bottomSheetRef$curre6 = bottomSheetRef.current) === null || _bottomSheetRef$curre6 === void 0 ? void 0 : _bottomSheetRef$curre6.forceClose(...args);
  }, []); //#endregion
  //#region bottom sheet modal methods

  const handlePresent = useCallback(function handlePresent(_data) {
    requestAnimationFrame(() => {
      setState({
        mount: true,
        data: _data
      });
      mountSheet(key, ref, stackBehavior);
      print({
        component: BottomSheetModal.name,
        method: handlePresent.name
      });
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [key, stackBehavior, mountSheet]);
  const handleDismiss = useCallback(function handleDismiss(animationConfigs) {
    var _bottomSheetRef$curre7;

    print({
      component: BottomSheetModal.name,
      method: handleDismiss.name,
      params: {
        currentIndexRef: currentIndexRef.current,
        minimized: minimized.current
      }
    });
    /**
     * if modal is already been dismiss, we exit the method.
     */

    if (currentIndexRef.current === -1 && minimized.current === false) {
      return;
    }

    if (minimized.current || currentIndexRef.current === -1 && enablePanDownToClose) {
      unmount();
      return;
    }

    willUnmountSheet(key);
    forcedDismissed.current = true;
    (_bottomSheetRef$curre7 = bottomSheetRef.current) === null || _bottomSheetRef$curre7 === void 0 ? void 0 : _bottomSheetRef$curre7.forceClose(animationConfigs);
  }, [willUnmountSheet, unmount, key, enablePanDownToClose]);
  const handleMinimize = useCallback(function handleMinimize() {
    var _bottomSheetRef$curre8;

    print({
      component: BottomSheetModal.name,
      method: handleMinimize.name,
      params: {
        minimized: minimized.current
      }
    });

    if (minimized.current) {
      return;
    }

    minimized.current = true;
    /**
     * if modal got minimized before it finish its mounting
     * animation, we set the `restoreIndexRef` to the
     * provided index.
     */

    if (currentIndexRef.current === -1) {
      restoreIndexRef.current = index;
    } else {
      restoreIndexRef.current = currentIndexRef.current;
    }

    (_bottomSheetRef$curre8 = bottomSheetRef.current) === null || _bottomSheetRef$curre8 === void 0 ? void 0 : _bottomSheetRef$curre8.close();
  }, [index]);
  const handleRestore = useCallback(function handleRestore() {
    var _bottomSheetRef$curre9;

    print({
      component: BottomSheetModal.name,
      method: handleRestore.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });

    if (!minimized.current || forcedDismissed.current) {
      return;
    }

    minimized.current = false;
    (_bottomSheetRef$curre9 = bottomSheetRef.current) === null || _bottomSheetRef$curre9 === void 0 ? void 0 : _bottomSheetRef$curre9.snapToIndex(restoreIndexRef.current);
  }, []); //#endregion
  //#region callbacks

  const handlePortalOnUnmount = useCallback(function handlePortalOnUnmount() {
    var _bottomSheetRef$curre10;

    print({
      component: BottomSheetModal.name,
      method: handlePortalOnUnmount.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });
    /**
     * if modal is already been dismiss, we exit the method.
     */

    if (currentIndexRef.current === -1 && minimized.current === false) {
      return;
    }

    mounted.current = false;
    forcedDismissed.current = true;

    if (minimized.current) {
      unmount();
      return;
    }

    willUnmountSheet(key);
    (_bottomSheetRef$curre10 = bottomSheetRef.current) === null || _bottomSheetRef$curre10 === void 0 ? void 0 : _bottomSheetRef$curre10.close();
  }, [key, unmount, willUnmountSheet]);
  const handlePortalRender = useCallback(function handlePortalRender(render) {
    if (mounted.current) {
      render();
    }
  }, []);
  const handleBottomSheetOnChange = useCallback(function handleBottomSheetOnChange(_index) {
    print({
      component: BottomSheetModal.name,
      method: handleBottomSheetOnChange.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });
    currentIndexRef.current = _index;

    if (_providedOnChange) {
      _providedOnChange(_index);
    }
  }, [_providedOnChange]);
  const handleBottomSheetOnClose = useCallback(function handleBottomSheetOnClose() {
    print({
      component: BottomSheetModal.name,
      method: handleBottomSheetOnClose.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current
      }
    });

    if (minimized.current) {
      return;
    }

    if (enableDismissOnClose) {
      unmount();
    }
  }, [enableDismissOnClose, unmount]); //#endregion
  //#region expose methods

  useImperativeHandle(ref, () => ({
    // sheet
    snapToIndex: handleSnapToIndex,
    snapToPosition: handleSnapToPosition,
    expand: handleExpand,
    collapse: handleCollapse,
    close: handleClose,
    forceClose: handleForceClose,
    // modal methods
    dismiss: handleDismiss,
    present: handlePresent,
    // internal
    minimize: handleMinimize,
    restore: handleRestore
  })); //#endregion
  // render
  // console.log('BottomSheetModal', index, mount, data);

  return mount ? /*#__PURE__*/React.createElement(Portal, {
    key: key,
    name: key,
    handleOnMount: handlePortalRender,
    handleOnUpdate: handlePortalRender,
    handleOnUnmount: handlePortalOnUnmount
  }, /*#__PURE__*/React.createElement(ContainerComponent, {
    key: key
  }, /*#__PURE__*/React.createElement(BottomSheet, _extends({}, bottomSheetProps, {
    ref: bottomSheetRef,
    key: key,
    index: index,
    snapPoints: snapPoints,
    enablePanDownToClose: enablePanDownToClose,
    animateOnMount: animateOnMount,
    containerHeight: containerHeight,
    containerOffset: containerOffset,
    onChange: handleBottomSheetOnChange,
    onClose: handleBottomSheetOnClose,
    children: typeof Content === 'function' ? /*#__PURE__*/React.createElement(Content, {
      data: data
    }) : Content,
    $modal: true
  })))) : null;
});
const BottomSheetModal = /*#__PURE__*/memo(BottomSheetModalComponent);
BottomSheetModal.displayName = 'BottomSheetModal';
export default BottomSheetModal;
//# sourceMappingURL=BottomSheetModal.js.map