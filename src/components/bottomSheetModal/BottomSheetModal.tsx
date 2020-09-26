import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import isEqual from 'lodash.isequal';
import { useValue } from 'react-native-redash';
import { Extrapolate, interpolate } from 'react-native-reanimated';
import BottomSheet from '../bottomSheet';
import type { BottomSheetModalType, BottomSheetModalProps } from './types';

type BottomSheetModal = BottomSheetModalType;

const BottomSheetModalComponent = forwardRef<
  BottomSheetModal,
  BottomSheetModalProps
>(({ content, configs, unmount }, ref) => {
  const {
    initialSnapIndex = 0,
    snapPoints: _snapPoints,
    overlayComponent: OverlayComponent,
    overlayOpacity = 0.5,
    dismissOnOverlayPress = true,
    onChange: _onChange,
    ...bottomSheetProps
  } = configs;

  //#region refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const isTemporaryClosing = useRef(false);
  const lastSheetPosition = useRef(initialSnapIndex);
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
  const snapPoints = useMemo(() => [0, ..._snapPoints], [_snapPoints]);
  //#endregion

  //#region callbacks
  const handleChange = useCallback(
    index => {
      if (_onChange) {
        _onChange(index);
      }

      if (!isTemporaryClosing.current) {
        lastSheetPosition.current = index;

        if (index < 1) {
          unmount();
        }
      }
    },
    [unmount, _onChange]
  );
  const handleClose = useCallback(() => {
    if (isTemporaryClosing.current) {
      unmount();
      return;
    }
    bottomSheetRef.current?.close();
  }, [unmount]);
  const handleCollapse = useCallback(() => {
    bottomSheetRef.current?.snapTo(1);
  }, []);
  const handleSnapTo = useCallback((index: number) => {
    bottomSheetRef.current?.snapTo(index + 1);
  }, []);
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
    expand: bottomSheetRef.current!.expand,
    collapse: handleCollapse,
    temporaryCloseSheet: handleTemporaryCloseSheet,
    restoreSheetPosition: handleRestoreSheetPosition,
  }));
  useEffect(() => {
    bottomSheetRef.current?.snapTo(initialSnapIndex + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion

  // render
  return (
    <>
      {OverlayComponent && (
        <OverlayComponent
          animatedOpacity={animatedOverlayOpacity}
          {...(dismissOnOverlayPress ? { onPress: handleOverlayPress } : {})}
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        {...bottomSheetProps}
        initialSnapIndex={0}
        snapPoints={snapPoints}
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
