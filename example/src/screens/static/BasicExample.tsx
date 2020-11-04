/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import Animated, {
  interpolate,
  concat,
  Extrapolate,
} from 'react-native-reanimated';
import { ReText, useValue } from 'react-native-redash';
import BottomSheet from '@gorhom/bottom-sheet';
import Handle from '../../components/handle';
import Button from '../../components/button';

const BasicExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const headerHeight = useHeaderHeight();

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const positionIndex = useValue<number>(0);

  // styles
  const shadowOverlayStyle = useMemo(
    () => ({
      ...styles.shadowOverlay,
      opacity: interpolate(positionIndex, {
        inputRange: [0, 2],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        label="Snap To 450"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(2)}
      />
      <Button
        label="Snap To 300"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Snap To 150"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />
      <ReText text={concat('Position from bottom: ', positionIndex)} />
      <Animated.View pointerEvents="none" style={shadowOverlayStyle} />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={0}
        handleComponent={Handle}
        shouldMeasureContentHeight={true}
        topInset={headerHeight}
        animatedPositionIndex={positionIndex}
        onChange={handleSheetChanges}
      >
        <CustomView />
      </BottomSheet>
    </View>
  );
};

const CustomView = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <View style={styles.contentContainer}>
      <View
        style={{
          height: 400,
          backgroundColor: 'green',
        }}
      >
        <Button
          label={`${toggle ? 'Disable' : 'Enable'}`}
          style={styles.buttonContainer}
          onPress={() => setToggle(state => !state)}
        />
      </View>
      {toggle && (
        <View
          style={{
            height: 250,
            backgroundColor: 'green',
          }}
        />
      )}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 10,
          backgroundColor: 'red',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 10,
          backgroundColor: 'red',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainerStyle: {
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  shadowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 46,
    lineHeight: 46,
    fontWeight: '800',
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginBottom: 6,
  },
  contentContainer: {
    backgroundColor: 'blue',
  },
});

export default BasicExample;
