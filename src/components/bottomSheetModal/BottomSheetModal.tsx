import { Portal, usePortal } from '@gorhom/portal';
import React, {
  forwardRef,
  memo,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { SNAP_POINT_TYPE } from '../../constants';
import { useBottomSheetModalInternal } from '../../hooks';
import type { BottomSheetMethods, BottomSheetModalMethods } from '../../types';
import { print } from '../../utilities';
import { id } from '../../utilities/id';
import BottomSheet from '../bottomSheet';
import {
  DEFAULT_ENABLE_DISMISS_ON_CLOSE,
  DEFAULT_STACK_BEHAVIOR,
} from './constants';
import type {
  BottomSheetModalPrivateMethods,
  BottomSheetModalProps,
  BottomSheetModalState,
} from './types';

const INITIAL_STATE: BottomSheetModalState = {
  mount: false,
  data: undefined,
};

// biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.
type BottomSheetModal<T = any> = BottomSheetModalMethods<T>;

// biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.
function BottomSheetModalComponent<T = any>(
  props: BottomSheetModalProps<T>,
  ref: React.ForwardedRef<BottomSheetModal<T>>
) {
  const {
    // modal props
    name,
    stackBehavior = DEFAULT_STACK_BEHAVIOR,
    enableDismissOnClose = DEFAULT_ENABLE_DISMISS_ON_CLOSE,
    onDismiss: _providedOnDismiss,
    onAnimate: _providedOnAnimate,

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
  const [{ mount, data }, setState] =
    useState<BottomSheetModalState<T>>(INITIAL_STATE);
  //#endregion

  //#region hooks
  const {
    hostName,
    containerLayoutState,
    mountSheet,
    unmountSheet,
    willUnmountSheet,
  } = useBottomSheetModalInternal();
  const { removePortal: unmountPortal } = usePortal(hostName);
  //#endregion

  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentIndexRef = useRef(!animateOnMount ? index : -1);
  const nextIndexRef = useRef<number | null>(null);
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
      if (__DEV__) {
        print({
          component: BottomSheetModal.name,
          method: unmount.name,
        });
      }
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
  const handleExpand: BottomSheetMethods['expand'] = useCallback((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.expand(...args);
  }, []);
  const handleCollapse: BottomSheetMethods['collapse'] = useCallback(
    (...args) => {
      if (minimized.current) {
        return;
      }
      bottomSheetRef.current?.collapse(...args);
    },
    []
  );
  const handleClose: BottomSheetMethods['close'] = useCallback((...args) => {
    if (minimized.current) {
      return;
    }
    bottomSheetRef.current?.close(...args);
  }, []);
  const handleForceClose: BottomSheetMethods['forceClose'] = useCallback(
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
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  // biome-ignore lint/correctness/useExhaustiveDependencies(ref): ref is a stable object
  const handlePresent = useCallback(
    function handlePresent(_data?: T) {
      requestAnimationFrame(() => {
        setState({
          mount: true,
          data: _data,
        });
        mountSheet(
          key,
          ref as unknown as RefObject<BottomSheetModalPrivateMethods>,
          stackBehavior
        );
        ref;

        if (__DEV__) {
          print({
            component: BottomSheetModal.name,
            method: handlePresent.name,
          });
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, stackBehavior, mountSheet]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleDismiss = useCallback<BottomSheetModalMethods['dismiss']>(
    function handleDismiss(animationConfigs) {
      if (__DEV__) {
        print({
          component: BottomSheetModal.name,
          method: handleDismiss.name,
          params: {
            currentIndexRef: currentIndexRef.current,
            minimized: minimized.current,
          },
        });
      }

      const animating = nextIndexRef.current != null;

      /**
       * early exit, if not minimized, it is in closed position and not animating
       */
      if (
        currentIndexRef.current === -1 &&
        minimized.current === false &&
        !animating
      ) {
        return;
      }

      /**
       * unmount and early exit, if minimized or it is in closed position and not animating
       */
      if (
        !animating &&
        (minimized.current ||
          (currentIndexRef.current === -1 && enablePanDownToClose))
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
      if (__DEV__) {
        print({
          component: BottomSheetModal.name,
          method: handleMinimize.name,
          params: {
            minimized: minimized.current,
          },
        });
      }
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
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleRestore = useCallback(function handleRestore() {
    if (__DEV__) {
      print({
        component: BottomSheetModal.name,
        method: handleRestore.name,
        params: {
          minimized: minimized.current,
          forcedDismissed: forcedDismissed.current,
        },
      });
    }
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
      if (__DEV__) {
        print({
          component: BottomSheetModal.name,
          method: handlePortalOnUnmount.name,
          params: {
            minimized: minimized.current,
            forcedDismissed: forcedDismissed.current,
          },
        });
      }
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
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleBottomSheetOnChange = useCallback(
    function handleBottomSheetOnChange(
      _index: number,
      _position: number,
      _type: SNAP_POINT_TYPE
    ) {
      if (__DEV__) {
        print({
          component: BottomSheetModal.name,
          method: handleBottomSheetOnChange.name,
          category: 'callback',
          params: {
            minimized: minimized.current,
            forcedDismissed: forcedDismissed.current,
          },
        });
      }
      currentIndexRef.current = _index;
      nextIndexRef.current = null;

      if (_providedOnChange) {
        _providedOnChange(_index, _position, _type);
      }
    },
    [_providedOnChange]
  );
  const handleBottomSheetOnAnimate = useCallback(
    (
      fromIndex: number,
      toIndex: number,
      fromPosition: number,
      toPosition: number
    ) => {
      nextIndexRef.current = toIndex;

      if (_providedOnAnimate) {
        _providedOnAnimate(fromIndex, toIndex, fromPosition, toPosition);
      }
    },
    [_providedOnAnimate]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies(BottomSheetModal.name): used for debug only
  const handleBottomSheetOnClose = useCallback(
    function handleBottomSheetOnClose() {
      if (__DEV__) {
        print({
          component: BottomSheetModal.name,
          method: handleBottomSheetOnClose.name,
          category: 'callback',
          params: {
            minimized: minimized.current,
            forcedDismissed: forcedDismissed.current,
          },
        });
      }

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
  return mount ? (
    <Portal
      key={key}
      name={key}
      hostName={hostName}
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
          containerLayoutState={containerLayoutState}
          onChange={handleBottomSheetOnChange}
          onClose={handleBottomSheetOnClose}
          onAnimate={handleBottomSheetOnAnimate}
          $modal={true}
        >
          {typeof Content === 'function' ? <Content data={data} /> : Content}
        </BottomSheet>
      </ContainerComponent>
    </Portal>
  ) : null;
}

const BottomSheetModal = memo(forwardRef(BottomSheetModalComponent)) as <
  // biome-ignore lint/suspicious/noExplicitAny: Using 'any' allows users to define their own strict types for 'data' property.
  T = any,
>(
  props: BottomSheetModalProps<T> & {
    ref?: React.ForwardedRef<BottomSheetModal<T>>;
  }
) => ReturnType<typeof BottomSheetModalComponent>;
(
  BottomSheetModal as React.MemoExoticComponent<
    typeof BottomSheetModalComponent
  >
).displayName = 'BottomSheetModal';

export default BottomSheetModal;
