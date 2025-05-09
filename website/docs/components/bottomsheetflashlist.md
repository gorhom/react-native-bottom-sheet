---
id: bottomsheetflashlist
title: BottomSheetFlashList
sidebar_label: ⭐️ FlashList
description: a pre-integrated React Native FlashList with BottomSheet gestures.
image: /img/bottom-sheet-preview.gif
slug: /components/bottomsheetflashlist
---

A pre-integrated [**FlashList**](https://shopify.github.io/flash-list/) component with `BottomSheet` gestures.

## Props

Inherits `FlashListProps` from [FlashList](https://shopify.github.io/flash-list/docs/usage).

### focusHook

This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with React Navigation. You will need to provide `useFocusEffect` from `@react-navigation/native`.

| type     | default           | required |
| -------- | ----------------- | -------- |
| function | `React.useEffect` | NO       |


## Example

```tsx
import React, { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlashList } from "@gorhom/bottom-sheet";


const keyExtractor = (item) => item;

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
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  const renderItem = useCallback(({ item }) => {
    return (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    );
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <BottomSheetFlashList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={43.3}
        />
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
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default App;
```
