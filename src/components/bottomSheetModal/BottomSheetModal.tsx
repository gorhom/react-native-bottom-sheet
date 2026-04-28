/** biome-ignore-all lint/correctness/useHookAtTopLevel: random error needs extra time to debug */
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
  MODAL_STATUS,
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

type BottomSheetModal<T = never> = BottomSheetModalMethods<T>;

function BottomSheetModalComponent<T = never>(
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
  const statusRef = useRef<MODAL_STATUS>(MODAL_STATUS.INITIAL);
  const currentIndexRef = useRef(!animateOnMount ? index : -1);
  const nextIndexRef = useRef<number | null>(null);
  const restoreIndexRef = useRef(-1);
  //#endregion

  //#region variables
  const key = useMemo(() => name || `bottom-sheet-modal-${id()}`, [name]);
  //#endregion

  //#region private methods
  const resetVariables = useCallback(function resetVariables() {
    if (__DEV__) {
      print({
        component: 'BottomSheetModal',
        method: resetVariables.name,
      });
    }
    currentIndexRef.current = -1;
    restoreIndexRef.current = -1;
    statusRef.current = MODAL_STATUS.INITIAL;
  }, []);
  const unmount = useCallback(
    function unmount() {
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: unmount.name,
        });
      }
      // reset variables
      resetVariables();

      // unmount sheet and portal
      unmountSheet(key);
      unmountPortal(key);

      // unmount the node, if sheet is still mounted
      if (
        [MODAL_STATUS.PRESENTED, MODAL_STATUS.ANIMATING].includes(
          statusRef.current
        )
      ) {
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
      if (
        statusRef.current === MODAL_STATUS.MINIMIZED ||
        statusRef.current === MODAL_STATUS.MINIMIZING
      ) {
        return;
      }
      bottomSheetRef.current?.snapToIndex(...args);
    },
    []
  );
  const handleSnapToPosition = useCallback<
    BottomSheetMethods['snapToPosition']
  >((...args) => {
    if (
      [
        MODAL_STATUS.MINIMIZED,
        MODAL_STATUS.MINIMIZING,
        MODAL_STATUS.DISMISSED,
        MODAL_STATUS.DISMISSING,
      ].includes(statusRef.current)
    ) {
      return;
    }
    bottomSheetRef.current?.snapToPosition(...args);
  }, []);
  const handleExpand: BottomSheetMethods['expand'] = useCallback((...args) => {
    if (
      [
        MODAL_STATUS.MINIMIZED,
        MODAL_STATUS.MINIMIZING,
        MODAL_STATUS.DISMISSED,
        MODAL_STATUS.DISMISSING,
      ].includes(statusRef.current)
    ) {
      return;
    }
    bottomSheetRef.current?.expand(...args);
  }, []);
  const handleCollapse: BottomSheetMethods['collapse'] = useCallback(
    (...args) => {
      if (
        [
          MODAL_STATUS.MINIMIZED,
          MODAL_STATUS.MINIMIZING,
          MODAL_STATUS.DISMISSED,
          MODAL_STATUS.DISMISSING,
        ].includes(statusRef.current)
      ) {
        return;
      }
      bottomSheetRef.current?.collapse(...args);
    },
    []
  );
  const handleClose: BottomSheetMethods['close'] = useCallback((...args) => {
    if (
      [
        MODAL_STATUS.MINIMIZED,
        MODAL_STATUS.MINIMIZING,
        MODAL_STATUS.DISMISSED,
        MODAL_STATUS.DISMISSING,
        MODAL_STATUS.CLOSED,
      ].includes(statusRef.current)
    ) {
      return;
    }
    bottomSheetRef.current?.close(...args);
  }, []);
  const handleForceClose: BottomSheetMethods['forceClose'] = useCallback(
    (...args) => {
      if (
        [
          MODAL_STATUS.MINIMIZED,
          MODAL_STATUS.MINIMIZING,
          MODAL_STATUS.DISMISSED,
          MODAL_STATUS.DISMISSING,
          MODAL_STATUS.CLOSED,
        ].includes(statusRef.current)
      ) {
        return;
      }
      bottomSheetRef.current?.forceClose(...args);
    },
    []
  );
  //#endregion

  //#region bottom sheet modal methods
  // biome-ignore lint/correctness/useExhaustiveDependencies(ref): ref is a stable object
  const handlePresent = useCallback(
    function handlePresent(_data?: T) {
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: handlePresent.name,
          params: {
            currentIndexRef: currentIndexRef.current,
            nextIndexRef: nextIndexRef.current,
            status: statusRef.current,
          },
        });
      }

      requestAnimationFrame(() => {
        if (mount && bottomSheetRef.current) {
          statusRef.current = MODAL_STATUS.ANIMATING;
          bottomSheetRef.current.snapToIndex(index);
        }

        setState({
          mount: true,
          data: _data,
        });

        mountSheet(
          key,
          ref as unknown as RefObject<BottomSheetModalPrivateMethods>,
          stackBehavior
        );
      });
    },
    [index, key, stackBehavior, mount, mountSheet]
  );
  const handleDismiss = useCallback<BottomSheetModalMethods['dismiss']>(
    function handleDismiss(animationConfigs) {
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: handleDismiss.name,
          params: {
            status: statusRef.current,
          },
        });
      }

      /**
       * if the modal position is already in a closed position,
       * then we unmount the node and early exit.
       */
      if (
        [MODAL_STATUS.CLOSED, MODAL_STATUS.MINIMIZED].includes(
          statusRef.current
        ) ||
        (statusRef.current === MODAL_STATUS.DISMISSING &&
          currentIndexRef.current === -1)
      ) {
        statusRef.current = MODAL_STATUS.DISMISSED;
        unmount();
        return;
      }

      statusRef.current = MODAL_STATUS.DISMISSING;
      willUnmountSheet(key);
      bottomSheetRef.current?.forceClose(animationConfigs);
    },
    [willUnmountSheet, unmount, key]
  );
  const handleMinimize = useCallback(
    function handleMinimize() {
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: handleMinimize.name,
          params: {
            index,
            currentIndexRef: currentIndexRef.current,
            status: statusRef.current,
          },
        });
      }

      /**
       * if the modal is minimized or animating to a minimized position,
       * then we early exit the method.
       */
      if (
        statusRef.current === MODAL_STATUS.MINIMIZED ||
        statusRef.current === MODAL_STATUS.MINIMIZING
      ) {
        return;
      }

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

      statusRef.current = MODAL_STATUS.MINIMIZING;
      bottomSheetRef.current?.close();
    },
    [index]
  );
  const handleRestore = useCallback(function handleRestore() {
    if (__DEV__) {
      print({
        component: 'BottomSheetModal',
        method: handleRestore.name,
        params: {
          status: statusRef.current,
        },
      });
    }

    /**
     * we only restore if the modal is minimized or going to be.
     */
    const minimizedOrGoingToBe = [
      MODAL_STATUS.MINIMIZING,
      MODAL_STATUS.MINIMIZED,
    ].includes(statusRef.current);
    if (!minimizedOrGoingToBe) {
      return;
    }
    bottomSheetRef.current?.snapToIndex(restoreIndexRef.current);
  }, []);
  //#endregion

  //#region callbacks
  const handlePortalOnUnmount = useCallback(
    function handlePortalOnUnmount() {
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: 'handlePortalOnUnmount',
          params: {
            status: statusRef.current,
          },
        });
      }

      if (statusRef.current === MODAL_STATUS.INITIAL) {
        return;
      }

      /**
       * if modal is already in minimized/closed position, then
       * unmount its node and early exit the method.
       */
      if (
        statusRef.current === MODAL_STATUS.MINIMIZED ||
        statusRef.current === MODAL_STATUS.DISMISSED ||
        currentIndexRef.current === -1
      ) {
        unmount();
        return;
      }

      statusRef.current = MODAL_STATUS.DISMISSING;
      willUnmountSheet(key);
      bottomSheetRef.current?.close();
    },
    [key, unmount, willUnmountSheet]
  );
  const handlePortalRender = useCallback(function handlePortalRender(
    render: () => void
  ) {
    if (__DEV__) {
      print({
        component: 'BottomSheetModal',
        method: 'handlePortalRender',
        params: {
          status: statusRef.current,
        },
      });
    }
    if ([MODAL_STATUS.DISMISSING].includes(statusRef.current)) {
      return;
    }
    render();
  }, []);
  const handleBottomSheetOnChange = useCallback(
    function handleBottomSheetOnChange(
      _index: number,
      _position: number,
      _type: SNAP_POINT_TYPE
    ) {
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: handleBottomSheetOnChange.name,
          category: 'callback',
          params: {
            status: statusRef.current,
          },
        });
      }
      currentIndexRef.current = _index;
      nextIndexRef.current = null;

      statusRef.current =
        _index === -1 ? MODAL_STATUS.MINIMIZED : MODAL_STATUS.PRESENTED;

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
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: 'handleBottomSheetOnAnimate',
          category: 'callback',
          params: {
            status: statusRef.current,
          },
        });
      }

      nextIndexRef.current = toIndex;

      /**
       * we do not want to override the pre-set status for minimizing or dismissing,
       * as they need to be set manually.
       */
      const currentStatusIsDismissingOrMinimizing = [
        MODAL_STATUS.DISMISSING,
        MODAL_STATUS.MINIMIZING,
      ].includes(statusRef.current);

      if (!(currentStatusIsDismissingOrMinimizing && toIndex === -1)) {
        statusRef.current = MODAL_STATUS.ANIMATING;
      }

      if (_providedOnAnimate) {
        _providedOnAnimate(fromIndex, toIndex, fromPosition, toPosition);
      }
    },
    [_providedOnAnimate]
  );
  const handleBottomSheetOnClose = useCallback(
    function handleBottomSheetOnClose() {
      if (__DEV__) {
        print({
          component: 'BottomSheetModal',
          method: 'handleBottomSheetOnClose',
          category: 'callback',
          params: {
            status: statusRef.current,
          },
        });
      }

      if (statusRef.current === MODAL_STATUS.DISMISSING) {
        statusRef.current = MODAL_STATUS.DISMISSED;
      } else if (statusRef.current === MODAL_STATUS.MINIMIZING) {
        statusRef.current = MODAL_STATUS.MINIMIZED;
      } else {
        statusRef.current = enableDismissOnClose
          ? MODAL_STATUS.DISMISSED
          : MODAL_STATUS.CLOSED;
      }

      if (statusRef.current !== MODAL_STATUS.DISMISSED) {
        return;
      }

      unmount();
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
    status: statusRef,
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
          {typeof Content === 'function' ? Content({ data }) : Content}
        </BottomSheet>
      </ContainerComponent>
    </Portal>
  ) : null;
}

const BottomSheetModal = memo(forwardRef(BottomSheetModalComponent)) as <
  T = never,
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
