import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  TouchableOpacity,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import { createLocationListMockData } from '../../utilities';
import {
  withModalProvider,
  SearchHandle,
  SEARCH_HANDLE_HEIGHT,
} from '@gorhom/bottom-sheet-example-app';
import { LocationItem } from '../../components/locationItem';
import {
  LocationDetails,
  LOCATION_DETAILS_HEIGHT,
} from '../../components/locationDetails';
import LocationDetailsHandle from '../../components/locationDetailsHandle';
import Weather from '../../components/weather';
import BlurredBackground from '../../components/blurredBackground';
import type { Location } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapExample = () => {
  const [selectedItem, setSelectedItem] = useState<Location>();

  // refs
  const mapRef = useRef<MapView>(null);
  const poiListModalRef = useRef<BottomSheetModal>(null);
  const poiDetailsModalRef = useRef<BottomSheetModal>(null);

  // hooks
  const headerHeight = useHeaderHeight();
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  //#region variables
  const data = useMemo(() => createLocationListMockData(15), []);
  const poiListSnapPoints = useMemo(
    () => [
      bottomSafeArea + SEARCH_HANDLE_HEIGHT,
      LOCATION_DETAILS_HEIGHT + bottomSafeArea,
      '100%',
    ],
    [bottomSafeArea]
  );
  const poiDetailsSnapPoints = useMemo(
    () => [
      LOCATION_DETAILS_HEIGHT + bottomSafeArea + SEARCH_HANDLE_HEIGHT,
      '100%',
    ],
    [bottomSafeArea]
  );
  const mapInitialCamera = useMemo(
    () => ({
      center: {
        latitude: 52.3791,
        longitude: 4.9003,
      },
      heading: 0,
      pitch: 0,
      zoom: 0,
      altitude: 40000,
    }),
    []
  );
  //#endregion

  //#region animated variables
  const animatedPOIListIndex = useSharedValue<number>(0);
  const animatedPOIListPosition = useSharedValue<number>(SCREEN_HEIGHT);
  const animatedPOIDetailsIndex = useSharedValue<number>(0);
  const animatedPOIDetailsPosition = useSharedValue<number>(SCREEN_HEIGHT);

  const weatherAnimatedIndex = useDerivedValue(() =>
    animatedPOIListIndex.value > animatedPOIDetailsIndex.value
      ? animatedPOIListIndex.value
      : animatedPOIDetailsIndex.value
  );
  const weatherAnimatedPosition = useDerivedValue(() =>
    animatedPOIListPosition.value < animatedPOIDetailsPosition.value
      ? animatedPOIListPosition.value
      : animatedPOIDetailsPosition.value
  );
  //#endregion

  //#region callbacks
  const handleTouchStart = useCallback(() => {
    poiListModalRef.current?.collapse();
  }, []);
  const handleCloseLocationDetails = useCallback(() => {
    setSelectedItem(undefined);
    poiDetailsModalRef.current?.dismiss();
  }, []);
  const handlePresentLocationDetails = useCallback((item: Location) => {
    setSelectedItem(item);
    poiDetailsModalRef.current?.present();
  }, []);
  //#endregion

  //#region styles
  const scrollViewAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animatedPOIListIndex.value,
  }));
  const scrollViewStyle = useMemo(
    () => [styles.scrollView, scrollViewAnimatedStyle],
    [scrollViewAnimatedStyle]
  );
  const scrollViewContentContainer = useMemo(
    () => [
      styles.scrollViewContentContainer,
      { paddingBottom: bottomSafeArea },
    ],
    [bottomSafeArea]
  );
  //#endregion

  //#region effects
  useLayoutEffect(() => {
    requestAnimationFrame(() => poiListModalRef.current?.present());
  }, []);
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
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={true}
        pressBehavior="none"
        appearsOnIndex={2}
        disappearsOnIndex={1}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialCamera={mapInitialCamera}
        zoomEnabled={false}
        style={styles.mapContainer}
        onTouchStart={handleTouchStart}
      />
      <Weather
        animatedIndex={weatherAnimatedIndex}
        animatedPosition={weatherAnimatedPosition}
      />
      <BottomSheetModal
        ref={poiListModalRef}
        key="PoiListSheet"
        name="PoiListSheet"
        index={1}
        snapPoints={poiListSnapPoints}
        handleHeight={SEARCH_HANDLE_HEIGHT}
        topInset={headerHeight}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
        keyboardBehavior="extend"
        animatedPosition={animatedPOIListPosition}
        animatedIndex={animatedPOIListIndex}
        handleComponent={SearchHandle}
        backdropComponent={renderBackdrop}
        backgroundComponent={BlurredBackground}
      >
        <BottomSheetScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
          style={scrollViewStyle}
          contentContainerStyle={scrollViewContentContainer}
        >
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={poiDetailsModalRef}
        key="PoiDetailsSheet"
        name="PoiDetailsSheet"
        snapPoints={poiDetailsSnapPoints}
        topInset={headerHeight}
        animatedIndex={animatedPOIDetailsIndex}
        animatedPosition={animatedPOIDetailsPosition}
        handleComponent={LocationDetailsHandle}
        backgroundComponent={BlurredBackground}
      >
        <LocationDetails
          onClose={handleCloseLocationDetails}
          {...(selectedItem as Location)}
        />
      </BottomSheetModal>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 16,
  },
});

export default withModalProvider(MapExample);
