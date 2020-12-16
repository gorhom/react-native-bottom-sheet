import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { interpolate, Extrapolate, max } from 'react-native-reanimated';
import { useValue } from 'react-native-redash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  TouchableOpacity,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import withModalProvider from '../withModalProvider';
import { createLocationListMockData, Location } from '../../utils';
import SearchHandle, {
  SEARCH_HANDLE_HEIGHT,
} from '../../components/searchHandle';
import LocationItem from '../../components/locationItem';
import LocationDetails, {
  LOCATION_DETAILS_HEIGHT,
} from '../../components/locationDetails';
import LocationDetailsHandle from '../../components/locationDetailsHandle';
import Weather from '../../components/weather';
import BlurredBackground from '../../components/blurredBackground';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

const MapExample = () => {
  const [selectedItem, setSelectedItem] = useState<Location>();

  // refs
  const mapRef = useRef<MapView>(null);
  const poiListModalRef = useRef<BottomSheetModal>(null);
  const poiDetailsModalRef = useRef<BottomSheetModal>(null);

  // hooks
  const { top: topSafeArea, bottom: bottomSafeArea } = useSafeAreaInsets();

  //#region variables
  const data = useMemo(() => createLocationListMockData(15), []);
  const poiListSnapPoints = useMemo(
    () => [
      SEARCH_HANDLE_HEIGHT,
      LOCATION_DETAILS_HEIGHT + bottomSafeArea,
      SCREEN_HEIGHT,
    ],
    [bottomSafeArea]
  );
  const poiDetailsSnapPoints = useMemo(
    () => [LOCATION_DETAILS_HEIGHT + bottomSafeArea, SCREEN_HEIGHT],
    [bottomSafeArea]
  );
  const animatedPosition = useValue<number>(0);
  const animatedModalPosition = useValue<number>(0);
  const animatedIndex = useValue<number>(0);
  const weatherAnimatedPosition = useMemo(
    () => max(animatedModalPosition, animatedPosition),
    [animatedModalPosition, animatedPosition]
  );
  //#endregion

  //#region callbacks
  const handleTouchStart = useCallback(() => {
    poiListModalRef.current?.collapse();
  }, []);
  const handleCloseLocationDetails = useCallback(() => {
    poiDetailsModalRef.current?.dismiss();
  }, []);
  const handlePresentLocationDetails = useCallback((item: Location) => {
    setSelectedItem(item);
    poiDetailsModalRef.current?.present();
  }, []);
  //#endregion

  //#region styles
  const scrollViewStyle = useMemo(
    () => [
      styles.scrollView,
      {
        opacity: interpolate(animatedIndex, {
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: Extrapolate.CLAMP,
        }),
      },
    ],
    [animatedIndex]
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
  useEffect(() => {
    poiListModalRef.current?.present();
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
        closeOnPress={false}
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
      <Weather
        animatedPosition={weatherAnimatedPosition}
        snapPoints={poiListSnapPoints}
      />
      <BottomSheetModal
        ref={poiListModalRef}
        name="PoiListSheet"
        index={1}
        snapPoints={poiListSnapPoints}
        topInset={topSafeArea}
        animatedPosition={animatedPosition}
        animatedIndex={animatedIndex}
        dismissOnPanDown={false}
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
        name="PoiDetailsSheet"
        index={0}
        snapPoints={poiDetailsSnapPoints}
        topInset={topSafeArea}
        animatedPosition={animatedModalPosition}
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
