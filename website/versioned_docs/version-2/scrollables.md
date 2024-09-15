---
id: scrollables
title: Scrollables
description: Bottom Sheet scrollables.
image: /img/bottom-sheet-preview.gif
slug: /scrollables
---

This library provides a pre-integrated virtualized lists that utilize an internal functionalities with the bottom sheet container to allow smooth panning interactions. These lists I called them Scrollables and they are:

- [BottomSheetFlatList](#bottomsheetflatlist)
- [BottomSheetSectionList](#bottomsheetsectionlist)
- [BottomSheetScrollView](#bottomsheetscrollview)
- [BottomSheetView](#bottomsheetview)

## BottomSheetFlatList

An extended component of `FlatList` from `react-native`, with bottom sheet integrations.

#### Props

##### `focusHook`

This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with React Navigation. You will need to provide `useFocusEffect` from `@react-navigation/native`.

| type     | default           | required |
| -------- | ----------------- | -------- |
| function | `React.useEffect` | NO       |

#### Example

```tsx
import React, { useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

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
    ({ item }) => (
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
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={i => i}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
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

## BottomSheetSectionList

Is an extended component of `SectionList` from `react-native`, with bottom sheet integrations.

#### Props

##### `focusHook`

This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with React Navigation. You will need to provide `useFocusEffect` from `@react-navigation/native`.

| type     | default           | required |
| -------- | ----------------- | -------- |
| function | `React.useEffect` | NO       |

#### Example

```tsx
import React, { useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import BottomSheet, { BottomSheetSectionList } from '@gorhom/bottom-sheet';

const App = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const sections = useMemo(
    () =>
      Array(10)
        .fill(0)
        .map((_, index) => ({
          title: `Section ${index}`,
          data: Array(10)
            .fill(0)
            .map((_, index) => `Item ${index}`),
        })),
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
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeaderContainer}>
        <Text>{section.title}</Text>
      </View>
    ),
    []
  );
  const renderItem = useCallback(
    ({ item }) => (
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
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetSectionList
          sections={sections}
          keyExtractor={i => i}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
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
  sectionHeaderContainer: {
    backgroundColor: 'white',
    padding: 6,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});

export default App;
```

## BottomSheetScrollView

Is an extended component of `ScrollView` from `react-native`, with bottom sheet integrations.

#### Props

##### `focusHook`

This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with React Navigation. You will need to provide `useFocusEffect` from `@react-navigation/native`.

| type     | default           | required |
| -------- | ----------------- | -------- |
| function | `React.useEffect` | NO       |

#### Example

```tsx
import React, { useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

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
    item => (
      <View key={item} style={styles.itemContainer}>
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
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainer}
        >
          {data.map(renderItem)}
        </BottomSheetScrollView>
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

## BottomSheetView

Is an extended component of `View` from `react-native`, with bottom sheet integrations.

> This only needed when the bottom sheet used with `React Navigation`.

#### Props

##### `focusHook`

This needed when bottom sheet used with multiple scrollables to allow bottom sheet detect the current scrollable ref, especially when used with React Navigation. You will need to provide `useFocusEffect` from `@react-navigation/native`.

| type     | default           | required |
| -------- | ----------------- | -------- |
| function | `React.useEffect` | NO       |

#### Example

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
    item => (
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
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetView style={styles.contentContainer}>
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
