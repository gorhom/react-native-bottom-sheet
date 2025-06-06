import BottomSheet from '@gorhom/bottom-sheet';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import {
  type StackNavigationOptions,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import React, {
  type ComponentProps,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../../components/button';
import createDummyScreen from './DummyScreen';

const Stack = createStackNavigator();
const ScreenA = createDummyScreen({
  title: 'FlatList Screen',
  nextScreen: 'ScrollView Screen',
  type: 'FlatList',
});

const ScreenB = createDummyScreen({
  title: 'ScrollView Screen',
  nextScreen: 'SectionList Screen',
  type: 'ScrollView',
  count: 25,
});

const ScreenC = createDummyScreen({
  title: 'SectionList Screen',
  nextScreen: 'View Screen',
  type: 'SectionList',
  count: 20,
});

const ScreenD = createDummyScreen({
  title: 'View Screen',
  nextScreen: 'FlatList Screen',
  type: 'View',
  count: 5,
});

const Navigator = () => {
  const screenOptions = useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerMode: 'float',
      headerShown: true,
      safeAreaInsets: { top: 0 },
      headerShadowVisible: false,
      cardStyle: {
        backgroundColor: 'white',
        overflow: 'visible',
      },
    }),
    []
  );

  const options = useMemo<ComponentProps<typeof Stack.Screen>['options']>(
    () => ({
      headerBackTitle: 'Back',
    }),
    []
  );
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="FlatList Screen"
            options={{ headerLeft: () => null }}
            component={ScreenA}
          />
          <Stack.Screen
            name="ScrollView Screen"
            options={options}
            component={ScreenB}
          />
          <Stack.Screen
            name="SectionList Screen"
            options={options}
            component={ScreenC}
          />
          <Stack.Screen
            name="View Screen"
            options={options}
            component={ScreenD}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

const NavigatorExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
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
      <Button label="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button label="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button label="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button label="Expand" onPress={() => handleExpandPress()} />
      <Button label="Collapse" onPress={() => handleCollapsePress()} />
      <Button label="Close" onPress={() => handleClosePress()} />
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        animateOnMount={true}
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
});

export default NavigatorExample;
