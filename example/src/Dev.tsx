/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import SearchHandle from './components/searchHandle';
import Button from './components/button';
import ContactList from './components/contactList';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const { height: windowHeight } = Dimensions.get('window');

const BasicExample = () => {
  //#region state
  const shownHeader = useRef(true);
  const [dynamicSnapPoint, setDynamicSnapPoint] = useState(300);
  //#endregion

  //#region hooks
  const { setOptions } = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { top: topSafeArea, bottom: bottomSafeArea } = useSafeAreaInsets();
  //#endregion

  //#region variables
  const snapPoints = useMemo(() => [150, 400, '100%'], []);
  const animatedPosition = useSharedValue<number>(0);
  const animatedContainerHeight = useSharedValue<number>(800);
  //#endregion

  //#region styles
  const containerStyle = useMemo(
    () => ({
      ...styles.container,
      paddingTop: topSafeArea,
    }),
    [topSafeArea]
  );

  const firstSnapPointLineStyle = useMemo(
    () => [
      styles.line,
      {
        height: snapPoints[0],
      },
    ],
    [snapPoints]
  );

  const secondSnapPointLineStyle = useMemo(
    () => [
      styles.line,
      {
        height: snapPoints[1],
      },
    ],
    [snapPoints]
  );

  const safeBottomLineStyle = useMemo(
    () => [
      styles.line,
      {
        height: bottomSafeArea,
      },
    ],
    [bottomSafeArea]
  );

  const sheetLineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animatedPosition.value }],
  }));
  const sheetLineStyle = useMemo(
    () => [styles.sheetLine, sheetLineAnimatedStyle],
    [sheetLineAnimatedStyle]
  );
  //#endregion

  //#region callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);
  const handleSnapPosition = useCallback(position => {
    bottomSheetRef.current?.snapTo(position);
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);
  const handleIncreaseDynamicSnapPoint = useCallback(() => {
    setDynamicSnapPoint(state => state + 50);
  }, []);
  const handleHideHeaderPress = useCallback(() => {
    shownHeader.current = !shownHeader.current;
    setOptions({
      headerShown: shownHeader.current,
    });
  }, []);
  //#endregion

  // renders
  return (
    <View style={containerStyle}>
      {/* <Button
        label="Increase Dynamic Snap Point"
        style={styles.buttonContainer}
        onPress={handleIncreaseDynamicSnapPoint}
      /> */}
      <Button
        label="Snap To 0"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Snap To 1"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Snap To 500px"
        style={styles.buttonContainer}
        onPress={() => handleSnapPosition(500)}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={handleClosePress}
      />

      <Button
        label="Hide Header"
        style={styles.buttonContainer}
        onPress={handleHideHeaderPress}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        animatedPosition={animatedPosition}
        keyboardBehavior="interactive"
        // topInset={topSafeArea}
        handleComponent={SearchHandle}
        animateOnMount={true}
        // onChange={handleSheetChanges}
      >
        {/* <ContactList type="FlatList" count={20} /> */}
        <View style={{}}>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: bottomSafeArea,
              borderWidth: 1,
              backgroundColor: 'red',
            }}
          />
        </View>
      </BottomSheet>
      {/* <Animated.View pointerEvents="none" style={sheetLineStyle} /> */}
      <View pointerEvents="none" style={secondSnapPointLineStyle} />
      <View pointerEvents="none" style={firstSnapPointLineStyle} />
      <View pointerEvents="none" style={safeBottomLineStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555',
    padding: 24,
  },
  buttonContainer: {
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'red',
    opacity: 1,
    padding: 6,
    margin: 6,
    borderRadius: 24,
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
  },
  sheetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    backgroundColor: 'red',
  },
});

const Stack = createStackNavigator();

export default () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="app" component={BasicExample} />
    </Stack.Navigator>
  </NavigationContainer>
);
