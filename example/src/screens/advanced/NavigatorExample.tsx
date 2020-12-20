import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createStackNavigator,
  HeaderBackButton,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import BottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet';
import Button from '../../components/button';
import createDummyScreen from '../DummyScreen';

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
  count: 25,
});

const ScreenC = createDummyScreen({
  title: 'SectionList Screen',
  nextScreen: 'ScreenD',
  type: 'SectionList',
  count: 20,
});

const ScreenD = createDummyScreen({
  title: 'View Screen',
  nextScreen: 'ScreenA',
  type: 'View',
  count: 5,
});

const Navigator = () => {
  const screenOptions = useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: true,
      safeAreaInsets: { top: 0 },
      headerLeft: ({ onPress, ...props }) => (
        <TouchableOpacity onPress={onPress}>
          <HeaderBackButton {...props} />
        </TouchableOpacity>
      ),
    }),
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
      <Stack.Screen name="ScreenD" component={ScreenD} />
    </Stack.Navigator>
  );
};

const NavigatorExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
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
        label="Expand"
        style={styles.buttonContainer}
        onPress={() => handleExpandPress()}
      />
      <Button
        label="Collapse"
        style={styles.buttonContainer}
        onPress={() => handleCollapsePress()}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
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
