---
id: hooks
title: Hooks
description: Bottom Sheet hooks.
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
slug: /hooks
---

## `useBottomSheet`

This hook provides all the bottom sheet public [methods](methods), to the internal sheet content or handle.

> This hook works at any component inside the `BottomSheet`.

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

const SheetContent = () => {
  const { expand } = useBottomSheet();

  return (
    <View>
      <Button onPress={expand}>
    </View>
  )
}
```

## `useBottomSheetSpringConfigs`

**`Available only on v3, for now.`**

Generate animation spring configs.

```tsx
import React from 'react';
import BottomSheet, { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

const SheetContent = () => {

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  return (
    <BottomSheet
      // ... other props
      animationConfigs={animationConfigs}
    >
      {CONTENT HERE}
    </BottomSheet>
  )
}
```

## `useBottomSheetTimingConfigs`

**`Available only on v3, for now.`**

Generate animation timing configs.

```tsx
import React from 'react';
import BottomSheet, { useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { Easing } from 'react-native-reanimated';

const SheetContent = () => {

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.exp,
  });

  return (
    <BottomSheet
      // ... other props
      animationConfigs={animationConfigs}
    >
      {CONTENT HERE}
    </BottomSheet>
  )
}
```
