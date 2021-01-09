---
id: hooks
title: Hooks
slug: /hooks
hide_table_of_contents: true
---

## `useBottomSheet`

This hook provides all the bottom sheet public [methods](methods), to the internal sheet content or handle.

> This hook works at any component in `BottomSheet`.

```tsx
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
      animationConfigs={animationConfigs}
    >
      {CONTENT HERE}
    </BottomSheet>
  )
}
```

## `useBottomSheetSpringConfigs`

**`Available only on v3, for now.`**

Generate animation timing configs.

```tsx
import BottomSheet, { useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { Easing } from 'react-native-reanimated';

const SheetContent = () => {

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.exp,
  });

  return (
    <BottomSheet
      animationConfigs={animationConfigs}
    >
      {CONTENT HERE}
    </BottomSheet>
  )
}
```
