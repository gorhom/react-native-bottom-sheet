import React, { useEffect } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
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

const SNAP_POINTS = ['100%'];

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
      snapPoints={SNAP_POINTS}
      topInset={headerHeight}
      animatedIndex={index}
      animatedPosition={position}
      handleComponent={BlurredHandle}
      backgroundComponent={BlurredBackground}
      onDismiss={handleOnDismiss}
    >
      <LocationDetails
        onClose={handleCloseLocationDetails}
        {...(selectedLocation as Location)}
      />
    </BottomSheetModal>
  );
});
