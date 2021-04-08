/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, { concat, multiply } from 'react-native-reanimated';
import { ReText, useValue } from 'react-native-redash';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import ContactList from '../../components/contactList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: windowHeight } = Dimensions.get('window');

const BasicExample = () => {
  // state
  const [dynamicSnapPoint, setDynamicSnapPoint] = useState(450);

  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { top: topSafeArea, bottom: bottomSafeArea } = useSafeAreaInsets();

  // variables
  const snapPoints = useMemo(() => [150, dynamicSnapPoint], [dynamicSnapPoint]);
  const animatedPosition = useValue<number>(0);

  // styles
  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      paddingTop: topSafeArea,
    }),
    [topSafeArea]
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // eslint-disable-next-line no-console
    console.log('handleSheetChanges', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  const handleIncreaseDynamicSnapPoint = useCallback(() => {
    setDynamicSnapPoint(state => state + 50);
  }, []);

  // renders
  return (
    <View style={containerStyle}>
      <Button
        label="Increase Dynamic Snap Point"
        onPress={handleIncreaseDynamicSnapPoint}
      />
      <Button label="Snap To 150" onPress={() => handleSnapPress(0)} />
      <Button label="Close" onPress={() => handleClosePress()} />
      <ReText text={concat('Position from bottom: ', animatedPosition)} />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animateOnMount={true}
        animatedPosition={animatedPosition}
        containerHeight={windowHeight}
        topInset={StatusBar.currentHeight || topSafeArea}
        onChange={handleSheetChanges}
      >
        <ContactList type="ScrollView" count={15} />
        {/* <View
          style={{
            height: dynamicSnapPoint,
            backgroundColor: 'red',
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: bottomSafeArea,
              borderWidth: 1,
              backgroundColor: 'white',
            }}
          />
        </View> */}
      </BottomSheet>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          backgroundColor: 'red',
          transform: [
            {
              translateY: multiply(animatedPosition, -1),
            },
          ],
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 450,
          borderWidth: 1,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 150,
          borderWidth: 1,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: bottomSafeArea,
          borderWidth: 1,
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
  shadowBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
});

export default BasicExample;
