# Bottom Sheet View

Is an extended component of `View` from `react-native`, with bottom sheet integrations.

> This only needed when the bottom sheet used with `React Navigation`.

## Props

#### `focusHook`

This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with `React Navigation`. You will need to provide `useFocusEffect` from `@react-navigation/native`.

> `required:` NO | `type:` (effect: EffectCallback, deps?: DependencyList) => void | `default: ` React.useEffect

## Example

```tsx
import React, { useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const App = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
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

  // render
  const renderItem = useCallback(
    (item) => (
      <View style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );
  return (
    <View style={styles.container}>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      <BottomSheet
        ref={sheetRef}
        initialSnapIndex={1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetView
          contentContainerStyle={styles.contentContainer}
        >
          {data.map(renderItem)}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});

export default App;
```
