import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Portal, usePortal } from '@gorhom/portal';
import BottomSheet from '../bottomSheet';
import { useBottomSheetModalInternal } from '../../hooks';
import { print } from '../../utilities';
import {
  DEFAULT_STACK_BEHAVIOR,
  DEFAULT_ENABLE_DISMISS_ON_CLOSE,
} from './constants';
import type { BottomSheetModalMethods, BottomSheetMethods } from '../../types';
import type { BottomSheetModalProps } from './types';
import { id } from '../../utilities/id';

type BottomSheetModal = BottomSheetModalMethods;

const INITIAL_STATE: {
  mount: boolean;
  data: any;
} = {
  mount: false,
  data: undefined,
};

const BottomSheetModalComponent = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps
>(function BottomSheetModal(props, ref) {
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
  } = props;

  //#region state
  const [{ mount, data }, setState] = useState(INITIAL_STATE);
  //#endregion

  //#region hooks
  const {
    containerHeight,
    containerOffset,
    mountSheet,
    unmountSheet,
    willUnmountSheet,
  } = useBottomSheetModalInternal();
  const { removePortal: unmountPortal } = usePortal();
  //#endregion

  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentIndexRef = useRef(!animateOnMount ? index : -1);
  const restoreIndexRef = useRef(-1);
  const minimized = useRef(false);
  const forcedDismissed = useRef(false);
  const mounted = useRef(false);
  mounted.current = mount;
  //#endregion

  //#region variables
  const key = useMemo(() => name || `bottom-sheet-modal-${id()}`, [name]);
  //#endregion

  //#region private methods
  const resetVariables = useCallback(function resetVariables() {
    print({
      component: BottomSheetModal.name,
      method: resetVariables.name,
    });
    currentIndexRef.current = -1;
    restoreIndexRef.current = -1;
    minimized.current = false;
    mounted.current = false;
    forcedDismissed.current = false;
  }, []);
  const unmount = useCallback(
    function unmount() {
      print({
        component: BottomSheetModal.name,
        method: unmount.name,
      });
      const _mounted = mounted.current;

      // reset variables
      resetVariables();

      // unmount sheet and portal
      unmountSheet(key);
      unmountPortal(key);

      // unmount the node, if sheet is still mounted
      if (_mounted) {
        setState(INITIAL_STATE);
      }

      // fire `onDismiss` callback
      if (_providedOnDismiss) {
        _providedOnDismiss();
      }
    },
    [key, resetVariables, unmountSheet, unmountPortal, _providedOnDismiss]
  );
  //#endregion

  //#region bottom sheet methods
  const handleSnapToIndex = useCallback<BottomSheetMethods['snapToIndex']>(
    (...args) => {
      if (minimized.current) {
        return;
      }
      bottomSheetRef.current?.snapToIndex(...args);
    },
    []
  );
  const handleSnapToPosition = useCallback<
    BottomSheetMethods['snapToPosition']
  >((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.snapToPosition(...args);
  }, []);
  const handleExpand = useCallback<BottomSheetMethods['expand']>((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.expand(...args);
  }, []);
  const handleCollapse = useCallback<BottomSheetMethods['collapse']>(
    (...args) => {
      if (minimized.current) {
        return;
      }
      bottomSheetRef.current?.collapse(...args);
    },
    []
  );
  const handleClose = useCallback<BottomSheetMethods['close']>((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.close(...args);
  }, []);
  const handleForceClose = useCallback<BottomSheetMethods['forceClose']>(
    (...args) => {
      if (minimized.current) {
        return;
      }
      bottomSheetRef.current?.forceClose(...args);
    },
    []
  );
  //#endregion

  //#region bottom sheet modal methods
  const handlePresent = useCallback(
    function handlePresent(_data?: any) {
      requestAnimationFrame(() => {
        setState({
          mount: true,
          data: _data,
        });
        mountSheet(key, ref, stackBehavior);

        print({
          component: BottomSheetModal.name,
          method: handlePresent.name,
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, stackBehavior, mountSheet]
  );
  const handleDismiss = useCallback<BottomSheetModalMethods['dismiss']>(
    function handleDismiss(animationConfigs) {
      print({
        component: BottomSheetModal.name,
        method: handleDismiss.name,
        params: {
          currentIndexRef: currentIndexRef.current,
          minimized: minimized.current,
        },
      });
      /**
       * if modal is already been dismiss, we exit the method.
       */
      if (currentIndexRef.current === -1 && minimized.current === false) {
        return;
      }

      if (
        minimized.current ||
        (currentIndexRef.current === -1 && enablePanDownToClose)
      ) {
        unmount();
        return;
      }
      willUnmountSheet(key);
      forcedDismissed.current = true;
      bottomSheetRef.current?.forceClose(animationConfigs);
    },
    [willUnmountSheet, unmount, key, enablePanDownToClose]
  );
  const handleMinimize = useCallback(
    function handleMinimize() {
      print({
        component: BottomSheetModal.name,
        method: handleMinimize.name,
        params: {
          minimized: minimized.current,
        },
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
      bottomSheetRef.current?.close();
    },
    [index]
  );
  const handleRestore = useCallback(function handleRestore() {
    print({
      component: BottomSheetModal.name,
      method: handleRestore.name,
      params: {
        minimized: minimized.current,
        forcedDismissed: forcedDismissed.current,
      },
    });
    if (!minimized.current || forcedDismissed.current) {
      return;
    }
    minimized.current = false;
    bottomSheetRef.current?.snapToIndex(restoreIndexRef.current);
  }, []);
  //#endregion

  //#region callbacks
  const handlePortalOnUnmount = useCallback(
    function handlePortalOnUnmount() {
      print({
        component: BottomSheetModal.name,
        method: handlePortalOnUnmount.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current,
        },
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
      bottomSheetRef.current?.close();
    },
    [key, unmount, willUnmountSheet]
  );
  const handlePortalRender = useCallback(function handlePortalRender(
    render: () => void
  ) {
    if (mounted.current) {
      render();
    }
  },
  []);
  const handleBottomSheetOnChange = useCallback(
    function handleBottomSheetOnChange(_index: number) {
      print({
        component: BottomSheetModal.name,
        method: handleBottomSheetOnChange.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current,
        },
      });
      currentIndexRef.current = _index;

      if (_providedOnChange) {
        _providedOnChange(_index);
      }
    },
    [_providedOnChange]
  );
  const handleBottomSheetOnClose = useCallback(
    function handleBottomSheetOnClose() {
      print({
        component: BottomSheetModal.name,
        method: handleBottomSheetOnClose.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current,
        },
      });

      if (minimized.current) {
        return;
      }

      if (enableDismissOnClose) {
        unmount();
      }
    },
    [enableDismissOnClose, unmount]
  );
  //#endregion

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
    restore: handleRestore,
  }));
  //#endregion

  // render
  // console.log('BottomSheetModal', index, mount, data);
  return mount ? (
    <Portal
      key={key}
      name={key}
      handleOnMount={handlePortalRender}
      handleOnUpdate={handlePortalRender}
      handleOnUnmount={handlePortalOnUnmount}
    >
      <ContainerComponent key={key}>
        <BottomSheet
          {...bottomSheetProps}
          ref={bottomSheetRef}
          key={key}
          index={index}
          snapPoints={snapPoints}
          enablePanDownToClose={enablePanDownToClose}
          animateOnMount={animateOnMount}
          containerHeight={containerHeight}
          containerOffset={containerOffset}
          onChange={handleBottomSheetOnChange}
          onClose={handleBottomSheetOnClose}
          children={
            typeof Content === 'function' ? Content({ data }) : Content
          }
          $modal={true}
        />
      </ContainerComponent>
    </Portal>
  ) : null;
});

const BottomSheetModal = memo(BottomSheetModalComponent);
BottomSheetModal.displayName = 'BottomSheetModal';

export default BottomSheetModal;
