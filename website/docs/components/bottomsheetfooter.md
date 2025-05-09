---
id: bottomsheetfooter
title: BottomSheetFooter
sidebar_label: Footer
description: an interactive footer component for the BottomSheet.
image: /img/bottom-sheet-preview.gif
slug: /components/bottomsheetfooter
---

A pre-built component that sticks to the bottom of the BottomSheet and can be modify to fit your own custom interaction.

## Props

### animatedFooterPosition

Calculated footer animated position.

| type                          | default | required |
| ----------------------------- | ------- | -------- |
| Animated.SharedValue\<number> | 0       | NO       |

### bottomInset

Bottom inset to be added below the footer.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### children

Component to be placed in the footer.

| type                     | default   | required |
| ------------------------ | --------- | -------- |
| ReactNode \| ReactNode[] | undefined | NO       |

## Example

```tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';

const App = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // renders
  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Footer</Text>
        </View>
      </BottomSheetFooter>
    ),
    []
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        footerComponent={renderFooter}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
});

export default App;
```
