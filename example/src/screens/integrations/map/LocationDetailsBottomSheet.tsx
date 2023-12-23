import React, { useEffect } from 'react';
import {
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useHeaderHeight } from '@react-navigation/elements';
import { SharedValue } from 'react-native-reanimated';
import { LocationDetails } from './LocationDetails';
import BlurredBackground from './BlurredBackground';
import BlurredHandle from './BlurredHandle';
import { Location } from '../../../types';

interface LocationDetailsBottomSheetProps {
  index: SharedValue<number>;
  position: SharedValue<number>;
}

export interface LocationDetailsBottomSheetMethods {
  present: (location: Location) => void;
}

const SNAP_POINTS = ['CONTENT_HEIGHT', '100%'];

export const LocationDetailsBottomSheet = forwardRef<
  LocationDetailsBottomSheetMethods,
  LocationDetailsBottomSheetProps
>(({ index, position }, ref) => {
  //#region refs
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  //#endregion

  //#region state
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  //#endregion

  //#region hooks
  const headerHeight = useHeaderHeight();
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(SNAP_POINTS);
  //#endregion

  //#region callbacks
  const handleCloseLocationDetails = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);
  const handleOnDismiss = useCallback(() => {
    setSelectedLocation(undefined);
  }, []);
  //#endregion

  //#region effects
  useImperativeHandle(ref, () => ({
    present: location => {
      setSelectedLocation(location);
    },
  }));

  useEffect(() => {
    if (selectedLocation) {
      bottomSheetRef.current?.present();
    }
  }, [selectedLocation]);
  //#endregion

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      key="PoiDetailsSheet"
      name="PoiDetailsSheet"
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      topInset={headerHeight}
      animatedIndex={index}
      animatedPosition={position}
      handleComponent={BlurredHandle}
      backgroundComponent={BlurredBackground}
      onDismiss={handleOnDismiss}
    >
      <LocationDetails
        onClose={handleCloseLocationDetails}
        onLayout={handleContentLayout}
        {...(selectedLocation as Location)}
      />
    </BottomSheetModal>
  );
});
