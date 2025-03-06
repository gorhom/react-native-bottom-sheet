---
id: bottomsheetscrollview
title: BottomSheetScrollView
sidebar_label: ScrollView
description: a pre-integrated React Native ScrollView with BottomSheet gestures.
image: /img/bottom-sheet-preview.gif
slug: /components/bottomsheetscrollview
---

A pre-integrated `React Native` ScrollView with `BottomSheet` gestures.

## Props

Inherits `ScrollViewProps` from `react-native`.

### focusHook

This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with React Navigation. You will need to provide `useFocusEffect` from `@react-navigation/native`.

| type     | default           | required |
| -------- | ----------------- | -------- |
| function | `React.useEffect` | NO       |

## Ignored Props

These props will be ignored if they were passed, because of the internal integration that uses them.

- `scrollEventThrottle`
- `decelerationRate`
- `onScrollBeginDrag`

## Example

```tsx
import React, { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

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
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  const renderItem = useCallback(
    (item: string) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.buttonView}>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      </View>
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  buttonView: {
    overflow: 'hidden'
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default App;
```
