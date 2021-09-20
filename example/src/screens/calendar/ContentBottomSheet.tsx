import React, {
  useRef,
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { BottomSheetHandle } from './BottomSheetHandle';
import { StyleSheet } from 'react-native';

export type ContentBottomSheetMethods = {
  /**
   * Open bottomsheet to fully show content (100% of content height).
   */
  open: () => void;
  /**
   * Open bottomsheet to fully show content (100% of content height).
   */
  // openTo: (contentPercentages: number) => void;
  /**
   * Snap to the maximum provided point from `snapPoints`.
   * @type () => void
   */
  close: () => void;
};

type BottomSheetProps = {
  children?: ReactNode;
  withBackdrop?: boolean;
};

export const ContentBottomSheet = forwardRef(
  (
    { children, withBackdrop = true }: PropsWithChildren<BottomSheetProps>,
    ref: React.Ref<ContentBottomSheetMethods>
  ) => {
    const reactNativeBottomSheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        // console.log(`bottom sheet: open is called`);
        reactNativeBottomSheetRef.current?.expand();
      },
      close: () => {
        // console.log(`bottom sheet: close is called`);
        reactNativeBottomSheetRef.current?.close();
      },
    }));

    const initialSnapPoints = useMemo(() => {
      return ['CONTENT_HEIGHT'];
    }, []);

    const {
      animatedHandleHeight,
      animatedSnapPoints,
      animatedContentHeight,
      handleContentLayout,
    } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

    const Handle = useMemo(() => {
      return () => (
        <BottomSheetHandle
          containerStyle={styles.handleContainerStyle}
          indicatorStyle={styles.handleIndicatorStyle}
        />
      );
    }, []);

    const Backdrop = useCallback(
      props => {
        return withBackdrop ? (
          <BottomSheetBackdrop
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            {...props}
          />
        ) : null;
      },
      [withBackdrop]
    );

    return (
      <>
        <BottomSheet
          ref={reactNativeBottomSheetRef}
          index={-1}
          snapPoints={animatedSnapPoints}
          handleHeight={animatedHandleHeight}
          contentHeight={animatedContentHeight}
          enablePanDownToClose={true}
          enableOverDrag={false}
          // Where should we put this property?
          enableContentInteractionWhileAnimating={false}
          handleComponent={Handle}
          backdropComponent={Backdrop}
        >
          <BottomSheetView
            onLayout={handleContentLayout}
            // Where should we put this property?
            enableContentInteractionWhileAnimating={false}
          >
            {children}
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  }
);

const styles = StyleSheet.create({
  handleContainerStyle: {
    backgroundColor: 'rgba(234, 244, 254, 1)',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  handleIndicatorStyle: { backgroundColor: 'rgba(45, 154, 252, 1)' },
});
