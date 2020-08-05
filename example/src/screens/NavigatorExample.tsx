import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHeaderHeight, createStackNavigator } from '@react-navigation/stack';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '../components/button';
import createDummyScreen from './DummyScreen';

const Stack = createStackNavigator();
const ScreenA = createDummyScreen({
  title: 'FlatList Screen',
  nextScreen: 'ScreenB',
  type: 'FlatList',
});

const ScreenB = createDummyScreen({
  title: 'ScrollView Screen',
  nextScreen: 'ScreenC',
  type: 'ScrollView',
});

const ScreenC = createDummyScreen({
  title: 'SectionList Screen',
  nextScreen: 'ScreenA',
  type: 'SectionList',
});

const Navigator = () => {
  const screenOptions = useMemo(
    () => ({ headerShown: true, safeAreaInsets: { top: 0 } }),
    []
  );

  const screenAOptions = useMemo(() => ({ headerLeft: () => null }), []);
  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen
        name="ScreenA"
        options={screenAOptions}
        component={ScreenA}
      />
      <Stack.Screen name="ScreenB" component={ScreenB} />
      <Stack.Screen name="ScreenC" component={ScreenC} />
    </Stack.Navigator>
  );
};

const NavigatorExample = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);
  const headerHeight = useHeaderHeight();

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapTo(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <Button
        label="Snap To 90%"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(2)}
      />
      <Button
        label="Snap To 50%"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Snap To 25%"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(0)}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={1}
        topInset={headerHeight}
        onChange={handleSheetChange}
      >
        <Navigator />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

export default NavigatorExample;
