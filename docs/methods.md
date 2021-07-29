---
id: methods
title: Methods
description: Bottom Sheet methods.
keywords:
  - bottomsheet
  - bottom-sheet
  - bottom sheet
  - react-native
  - react native
  - ios
  - android
  - sheet
  - modal
  - presentation modal
  - reanimated
image: /img/bottom-sheet-preview.gif
slug: /methods
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These methods are accessible using the bottom sheet reference.

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

### `snapTo`

Animate the sheet to one of the provided point from `snapPoints`.

```ts
type snapTo = (
  index: number,
  animationDuration?: number,
  animationEasing?: Animated.EasingFunction
) => void;
```

### `expand`

Animate the sheet to the maximum provided point from `snapPoints`.

```ts
type expand = (
  animationDuration?: number,
  animationEasing?: Animated.EasingFunction
) => void;
```

### `collapse`

Animate the sheet to the minimum provided point from `snapPoints`.

```ts
type collapse = (
  animationDuration?: number,
  animationEasing?: Animated.EasingFunction
) => void;
```

### `close`

Close the sheet.

```ts
type close = (
  animationDuration?: number,
  animationEasing?: Animated.EasingFunction
) => void;
```
