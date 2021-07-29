---
id: bottomsheetfooter
title: BottomSheetFooter
description: an interactive footer component for the BottomSheet.
image: /img/bottom-sheet-preview.gif
slug: /components/bottomsheetfooter
---

// TODO

## Props

### `appearanceBehavior`

Appearance behavior when the bottom sheet starts to push the footer of the screen. You can combine many behaviors together.

- `none`: do nothing.
- `fade`: fade in and out.
- `scale`: scale up and down.
- `slide`: slide up and down.

| type                                   | default | required |
| -------------------------------------- | ------- | -------- |
| 'none' \| 'fade' \| 'scale' \| 'slide' | 'none'  | NO       |

### `bottomInset`

Bottom inset to be added below the footer.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### `children`

Component to be placed in the footer.

| type                     | default | required |
| ------------------------ | ------- | -------- |
| ReactNode \| ReactNode[] | 0       | NO       |

## Example

```tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';

const App = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
        <BottomSheetFooter
          bottomInset={bottomSafeArea}
          appearanceBehavior={appearanceBehavior}
        >
          <View style={styles.footer}>
            <Text style={styles.footerText}>this is a footer!</Text>
          </View>
        </BottomSheetFooter>
      </BottomSheet>
    </View>
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

export default App;
```
