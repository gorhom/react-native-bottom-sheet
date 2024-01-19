import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Location } from '../../../types';
import Weather from './Weather';
import { withModalProvider } from '../../modal/withModalProvider';
import {
  LocationDetailsBottomSheet,
  LocationDetailsBottomSheetMethods,
} from './LocationDetailsBottomSheet';
import { LocationListBottomSheet } from './LocationListBottomSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapExample = () => {
  //#region refs
  const mapRef = useRef<MapView>(null);
  const poiListModalRef = useRef<BottomSheetModal>(null);
  const poiDetailsModalRef = useRef<LocationDetailsBottomSheetMethods>(null);
  //#endregion

  //#region variables
  const mapInitialCamera = useMemo(
    () => ({
      center: {
        latitude: 52.3791,
        longitude: 4.9003,
      },
      heading: 0,
      pitch: 0,
      zoom: 10,
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
  const handleOnLocationPress = useCallback((item: Location) => {
    poiDetailsModalRef.current?.present(item);
  }, []);
  //#endregion

  //#region effects
  useLayoutEffect(() => {
    requestAnimationFrame(() => poiListModalRef.current?.present());
  }, []);
  //#endregion

  // renders
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

      <LocationListBottomSheet
        ref={poiListModalRef}
        index={animatedPOIListIndex}
        position={animatedPOIListPosition}
        onItemPress={handleOnLocationPress}
      />
      <LocationDetailsBottomSheet
        ref={poiDetailsModalRef}
        index={animatedPOIDetailsIndex}
        position={animatedPOIDetailsPosition}
      />
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
