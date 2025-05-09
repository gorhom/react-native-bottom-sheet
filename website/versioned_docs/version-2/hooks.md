---
id: hooks
title: Hooks
description: Bottom Sheet hooks.
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
