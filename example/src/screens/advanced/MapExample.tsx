import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { interpolate, Extrapolate, Easing, max } from 'react-native-reanimated';
import { useValue } from 'react-native-redash';
import { useSafeArea } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetOverlay,
  TouchableOpacity,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import withModalProvider from '../withModalProvider';
import { createLocationListMockData, Location } from '../../utils';
import SearchHandle from '../../components/searchHandle';
import LocationItem from '../../components/locationItem';
import LocationDetails, {
  LOCATION_DETAILS_HEIGHT,
} from '../../components/locationDetails';
import LocationDetailsHandle from '../../components/locationDetailsHandle';
import Weather from '../../components/weather';
import BlurredBackground from '../../components/blurredBackground';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

const MapExample = () => {
  // refs
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const didRestoreMainSheetPosition = useRef(false);

  // hooks
  const { present, dismiss } = useBottomSheetModal();
  const { top: topSafeArea, bottom: bottomSafeArea } = useSafeArea();

  //#region variables
  const data = useMemo(() => createLocationListMockData(15), []);
  const snapPoints = useMemo(
    () => [
      bottomSafeArea,
      LOCATION_DETAILS_HEIGHT + bottomSafeArea,
      SCREEN_HEIGHT,
    ],
    [bottomSafeArea]
  );
  const animatedPosition = useValue<number>(0);
  const animatedModalPosition = useValue<number>(0);
  const animatedIndex = useValue<number>(0);
  const animatedOverlayOpacity = useMemo(
    () =>
      interpolate(animatedPosition, {
        inputRange: [snapPoints[1], snapPoints[2]],
        outputRange: [0, 0.25],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedPosition, snapPoints]
  );
  const weatherAnimatedPosition = useMemo(
    () => max(animatedModalPosition, animatedPosition),
    [animatedModalPosition, animatedPosition]
  );
  //#endregion

  //#region callbacks
  const handleLocationDetailSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      if (!didRestoreMainSheetPosition.current) {
        bottomSheetRef.current?.snapTo(1);
      }
      didRestoreMainSheetPosition.current = false;
    }
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleTouchStart = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleCloseLocationDetails = useCallback(() => {
    didRestoreMainSheetPosition.current = true;
    bottomSheetRef.current?.snapTo(1);
    dismiss();
  }, [dismiss]);
  const handlePresentLocationDetails = useCallback(
    (item: Location) => {
      bottomSheetRef.current?.close();
      present(
        <LocationDetails onClose={handleCloseLocationDetails} {...item} />,
        {
          index: 1,
          snapPoints,
          topInset: topSafeArea,
          animatedPosition: animatedModalPosition,
          animationDuration: 500,
          animationEasing: Easing.out(Easing.exp),
          onChange: handleLocationDetailSheetChanges,
          handleComponent: LocationDetailsHandle,
          backgroundComponent: BlurredBackground,
        }
      );
    },
    [
      snapPoints,
      animatedModalPosition,
      topSafeArea,
      present,
      handleCloseLocationDetails,
      handleLocationDetailSheetChanges,
    ]
  );
  //#endregion

  //#region styles
  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainerStyle,
      {
        opacity: interpolate(animatedIndex, {
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: Extrapolate.CLAMP,
        }),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  //#endregion

  // renders
  const renderItem = useCallback(
    (item, index) => (
      <TouchableOpacity
        key={`${item.name}.${index}`}
        onPress={() => handlePresentLocationDetails(item)}
      >
        <LocationItem title={item.name} subTitle={item.address} />
      </TouchableOpacity>
    ),
    [handlePresentLocationDetails]
  );
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialCamera={{
          center: {
            latitude: 52.3791,
            longitude: 4.9003,
          },
          heading: 0,
          pitch: 0,
          zoom: 0,
          altitude: 40000,
        }}
        zoomEnabled={false}
        style={styles.mapContainer}
        onTouchStart={handleTouchStart}
      />
      <BottomSheetOverlay
        pointerEvents="none"
        animatedOpacity={animatedOverlayOpacity}
      />

      <Weather
        animatedPosition={weatherAnimatedPosition}
        snapPoints={snapPoints}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        topInset={topSafeArea}
        animatedPosition={animatedPosition}
        animatedIndex={animatedIndex}
        animationDuration={500}
        animationEasing={Easing.out(Easing.exp)}
        onChange={handleSheetChanges}
        handleComponent={SearchHandle}
        backgroundComponent={BlurredBackground}
      >
        <BottomSheetScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
          style={contentContainerStyle}
        >
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainerStyle: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default withModalProvider(MapExample);
