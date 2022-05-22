import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import {
  createBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import {
  // BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createContactListMockData } from './utilities';
import { SearchHandle, ContactItem } from '@gorhom/bottom-sheet-example-app';

const SNAP_POINTS = [300];
const DATA = createContactListMockData(30);

const keyExtractor = (item: any, index: number) => `${item.name}.${index}`;

const App = () => {
  //#region state
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [filter, setFilter] = useState('');
  //#endregion

  //#region hooks
  const { top: topSafeArea } = useSafeAreaInsets();
  const bottomSafeArea = useBottomTabBarHeight();
  //#endregion

  //#region animated values
  const data = useMemo(
    () =>
      filter === '' ? DATA : DATA.filter(item => item.name.includes(filter)),
    [filter]
  );
  const animatedPosition = useSharedValue(0);
  //#endregion

  //#region styles
  const positionLineAnimatedStyle = useAnimatedStyle(() => ({
    top: animatedPosition.value,
  }));
  //#endregion

  //#region render
  const renderItem = useCallback(
    ({ item, index }) => (
      <ContactItem
        key={`${item.name}.${index}`}
        title={`${index}: ${item.name}`}
        subTitle={item.jobTitle}
      />
    ),
    []
  );
  const renderHandle = useCallback(
    props => (
      <SearchHandle
        key="search-handle"
        initialValue={filter}
        onChange={setFilter}
        {...props}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <View style={styles.container}>
      <Button
        title="Present"
        onPress={() => bottomSheetRef.current?.present()}
      />
      <Button
        title="Close"
        onPress={() => bottomSheetRef.current?.forceClose()}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={SNAP_POINTS}
        keyboardBehavior="interactive"
        topInset={topSafeArea}
        bottomInset={bottomSafeArea}
        animatedPosition={animatedPosition}
        // backdropComponent={props => (
        //   <BottomSheetBackdrop
        //     disappearsOnIndex={-1}
        //     appearsOnIndex={0}
        //     {...props}
        //   />
        // )}
        handleComponent={renderHandle}
      >
        <BottomSheetFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.flatlist}
          contentContainerStyle={styles.flatlistContainer}
        />
      </BottomSheetModal>

      {SNAP_POINTS.map(snapPoint => (
        <View
          pointerEvents="none"
          key={`line-${snapPoint}`}
          style={[styles.line, { bottom: snapPoint }]}
        />
      ))}

      <View
        pointerEvents="none"
        style={[styles.line, { top: topSafeArea, backgroundColor: 'green' }]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.line,
          { bottom: bottomSafeArea, backgroundColor: 'green' },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.line,
          { backgroundColor: 'blue' },
          positionLineAnimatedStyle,
        ]}
      />
    </View>
  );
  //#endregion
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'red',
  },
  flatlist: {
    flex: 1,
  },
  flatlistContainer: {
    paddingHorizontal: 24,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 12,
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: '#80f',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

const Tab = createBottomTabNavigator();

export default () => (
  <BottomSheetModalProvider>
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator>
        <Tab.Screen name="App" component={App} />
      </Tab.Navigator>
    </NavigationContainer>
  </BottomSheetModalProvider>
);
