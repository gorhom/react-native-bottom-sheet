---
id: methods
title: Methods
description: Bottom Sheet methods.
image: /img/bottom-sheet-preview.gif
slug: /methods
---

These methods are accessible using the bottom sheet reference or the hook `useBottomSheet` or `useBottomSheetModal`.

```tsx
import React, { useRef } from 'react';
import { Button } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const App = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef.current.close()

  return (
    <>
      <Button title="Close Sheet" onPress={handleClosePress} />
      <BottomSheet ref={bottomSheetRef}>
    </>
  )
}

```

### snapToIndex

Snap to one of the provided points from `snapPoints`.

```ts
type snapToIndex = (
  // snap point index.
  index: number,
  // snap animation configs
  animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
) => void;
```

### snapToPosition

Snap to a position out of provided `snapPoints`.

```ts
type snapToPosition = (
  // position in pixel or percentage.
  position: number,
  // snap animation configs
  animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
) => void;
```

### expand

Snap to the maximum provided point from `snapPoints`.

```ts
type expand = (
  // snap animation configs
  animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
) => void;
```

### collapse

Snap to the minimum provided point from `snapPoints`.

```ts
type collapse = (
  // snap animation configs
  animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
) => void;
```

### close

Close the bottom sheet.

```ts
type close = (
  // snap animation configs
  animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
) => void;
```

### forceClose

Force close the bottom sheet, this prevent any interruptions till the sheet is closed.

```ts
type forceClose = (
  // snap animation configs
  animationConfigs?: Animated.WithSpringConfig | Animated.WithTimingConfig
) => void;
```
