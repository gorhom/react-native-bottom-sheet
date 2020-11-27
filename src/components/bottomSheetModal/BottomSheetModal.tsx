import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import isEqual from 'lodash.isequal';
import { useValue } from 'react-native-redash';
import Animated, { Extrapolate, set } from 'react-native-reanimated';
import BottomSheet from '../bottomSheetContainer';
import {
  DEFAULT_OVERLAY_OPACITY,
  DEFAULT_DISMISS_ON_OVERLAY_PRESS,
  DEFAULT_DISMISS_ON_SCROLL_DOWN,
  DEFAULT_ALLOW_TOUCH_THROUGH_OVERLAY,
} from './constants';
import type { BottomSheetModalType, BottomSheetModalProps } from './types';

const {
  interpolate: interpolateV1,
  interpolateNode: interpolateV2,
} = require('react-native-reanimated');
const interpolate = interpolateV2 || interpolateV1;

type BottomSheetModal = BottomSheetModalType;

const BottomSheetModalComponent = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps
>(({ content, configs, unmount }, ref) => {
  const {
    initialSnapIndex: _initialSnapIndex = 0,
    snapPoints: _snapPoints,
    animatedPositionIndex: _animatedPositionIndex,
    allowTouchThroughOverlay = DEFAULT_ALLOW_TOUCH_THROUGH_OVERLAY,
    overlayComponent: OverlayComponent,
    overlayOpacity = DEFAULT_OVERLAY_OPACITY,
    dismissOnOverlayPress = DEFAULT_DISMISS_ON_OVERLAY_PRESS,
    dismissOnScrollDown = DEFAULT_DISMISS_ON_SCROLL_DOWN,
    onChange,
    ...bottomSheetProps
  } = configs;

  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const isTemporaryClosing = useRef(false);
  const lastSheetPosition = useRef(0);
  //#endregion

  //#region variables
  const animatedPositionIndex = useValue(0);
  const animatedOverlayOpacity = useMemo(
    () =>
      interpolate(animatedPositionIndex, {
        inputRange: [0, 1],
        outputRange: [0, overlayOpacity],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedPositionIndex, overlayOpacity]
  );
  const initialSnapIndex = useMemo(
    () => (dismissOnScrollDown ? _initialSnapIndex + 1 : _initialSnapIndex),
    [_initialSnapIndex, dismissOnScrollDown]
  );
  const snapPoints = useMemo(
    () => (dismissOnScrollDown ? [0, ..._snapPoints] : _snapPoints),
    [_snapPoints, dismissOnScrollDown]
  );
  const overlayPointerEvents = useMemo(
    () => (allowTouchThroughOverlay ? 'none' : 'auto'),
    [allowTouchThroughOverlay]
  );
  //#endregion

  //#region callbacks
  const handleChange = useCallback(
    index => {
      if (onChange) {
        onChange(index);
      }

      if (!isTemporaryClosing.current) {
        lastSheetPosition.current = index;

        if (index < (dismissOnScrollDown ? 1 : 0)) {
          unmount();
        }
      }
    },
    [unmount, onChange, dismissOnScrollDown]
  );
  const handleClose = useCallback(() => {
    if (isTemporaryClosing.current) {
      unmount();
      return;
    }
    bottomSheetRef.current?.close();
  }, [unmount]);
  const handleCollapse = useCallback(() => {
    if (dismissOnScrollDown) {
      bottomSheetRef.current?.snapTo(1);
    } else {
      bottomSheetRef.current?.collapse();
    }
  }, [dismissOnScrollDown]);
  const handleExpand = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleSnapTo = useCallback(
    (index: number) => {
      bottomSheetRef.current?.snapTo(index + (dismissOnScrollDown ? 1 : 0));
    },
    [dismissOnScrollDown]
  );
  const handleTemporaryCloseSheet = useCallback(() => {
    isTemporaryClosing.current = true;
    bottomSheetRef.current?.close();
  }, []);
  const handleRestoreSheetPosition = useCallback(() => {
    isTemporaryClosing.current = false;
    bottomSheetRef.current?.snapTo(lastSheetPosition.current);
  }, []);
  const handleOverlayPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  //#endregion

  //#region effects
  useImperativeHandle(ref, () => ({
    close: handleClose,
    snapTo: handleSnapTo,
    expand: handleExpand,
    collapse: handleCollapse,
    temporaryCloseSheet: handleTemporaryCloseSheet,
    restoreSheetPosition: handleRestoreSheetPosition,
  }));
  //#endregion

  // render
  return (
    <>
      {OverlayComponent && (
        <OverlayComponent
          animatedOpacity={animatedOverlayOpacity}
          pointerEvents={overlayPointerEvents}
          {...(dismissOnOverlayPress ? { onPress: handleOverlayPress } : {})}
        />
      )}

      {_animatedPositionIndex && (
        <Animated.Code
          exec={set(_animatedPositionIndex, animatedPositionIndex)}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        {...bottomSheetProps}
        initialSnapIndex={initialSnapIndex}
        snapPoints={snapPoints}
        animateOnMount={true}
        animatedPositionIndex={animatedPositionIndex}
        onChange={handleChange}
      >
        {content}
      </BottomSheet>
    </>
  );
});

const BottomSheetModal = memo(BottomSheetModalComponent, isEqual);

export default BottomSheetModal;
