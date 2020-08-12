import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import MapView from 'react-native-maps';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  useValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeArea } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import SearchHandle from '../components/searchHandle';
import LocationItem from '../components/locationItem';
import { createLocationListMockData } from '../utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { top: topSafeArea } = useSafeArea();

  // variables
  const data = useMemo(() => createLocationListMockData(15), []);
  const snapPoints = useMemo(
    () => [
      200,
      350,
      SCREEN_HEIGHT - topSafeArea - (StatusBar.currentHeight ?? 0),
    ],
    [topSafeArea]
  );
  const position = useValue<number>(0);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleTouchStart = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleRegionChangeComplete = useCallback(() => {
    bottomSheetRef.current?.snapTo(1);
  }, []);

  // styles
  const locationButtonStyle = useMemo(
    () => ({
      ...styles.locationButton,
      transform: [
        {
          translateY: interpolate(position, {
            inputRange: [200, 350],
            outputRange: [-200, -350],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
        {
          scale: interpolate(position, {
            inputRange: [350, 400],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // renders
  const renderBackground = useCallback(
    () =>
      Platform.OS === 'ios' ? (
        <BlurView blurType="ultraThinMaterial" style={styles.blurContainer} />
      ) : (
        <View style={styles.backgroundContainer} />
      ),
    []
  );
  const renderItem = useCallback(
    (item, index) => (
      <LocationItem
        key={`${item.name}.${index}`}
        title={item.name}
        subTitle={item.address}
      />
    ),
    []
  );
  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapContainer}
        onTouchStart={handleTouchStart}
        onRegionChangeComplete={handleRegionChangeComplete}
      />
      <Animated.View style={locationButtonStyle} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={1}
        topInset={topSafeArea}
        animatedPosition={position}
        handleComponent={SearchHandle}
        backgroundComponent={renderBackground}
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
          style={styles.contentContainerStyle}
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
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#333',
  },
  locationButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#888',
  },
});

export default MapExample;
