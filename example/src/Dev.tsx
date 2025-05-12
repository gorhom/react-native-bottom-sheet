import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  Button,
  type FlatList,
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const DATA = new Array(50).fill(0).map((_, index) => ({
  id: `item-${index}`,
}));

const SNAP_POINTS = [300, 600];

const renderItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text>{item.id}</Text>
  </View>
);

const App = () => {
  //#region ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [mount, setMount] = React.useState(false);
  //#endregion

  //#region hooks
  const { bottom: bottomSafeArea, top: topSafeArea } = useSafeAreaInsets();
  const { height } = useSafeAreaFrame();
  //#endregion

  //#region callbacks
  const handleOnLayout = useCallback(
    ({ nativeEvent: layout }: LayoutChangeEvent) => {
      // eslint-disable-next-line no-console
      console.log('BottomSheetFlatList::handleOnLayout', layout);
    },
    []
  );
  //#endregion

  //#region styles
  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: bottomSafeArea,
    }),
    [bottomSafeArea]
  );
  //#endregion

  // renders
  const ref = useRef<FlatList>(null);
  // ref.current?.getNativeScrollRef()
  return (
    <View style={styles.container}>
      <Button
        title="Mount"
        onPress={() => {
          setMount(prev => !prev);
        }}
      />
      {/* {<BottomSheetFlatList
            data={DATA}
            style={styles.itemList}
            contentContainerStyle={contentContainerStyle}
            renderItem={renderItem}
            onLayout={handleOnLayout}
          />} */}
      {mount ? (
        <BottomSheet
          ref={bottomSheetRef}
          topInset={topSafeArea}
          snapPoints={SNAP_POINTS}
          enableDynamicSizing={false}
        >
          <BottomSheetView>
            <Text>Hello World!</Text>
          </BottomSheetView>
        </BottomSheet>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  itemList: {
    flex: 1,
  },
  itemContainer: {
    padding: 6,
  },
});

export default () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);
