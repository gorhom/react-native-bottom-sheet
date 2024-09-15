---
id: hooks
title: Hooks
description: Bottom Sheet modal hooks.
image: /img/bottom-sheet-preview.gif
slug: /modal/hooks
---

## `useBottomSheetModal`

This hook provides modal functionalities only, for sheet functionalities please look at [Bottom Sheet Hooks](../hooks).

> This hook works at any component in `BottomSheetModalProvider`.

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

const SheetContent = () => {
  const { dismiss, dismissAll } = useBottomSheetModal();

  return (
    <View>
      <Button onPress={dismiss}>
    </View>
  )
}
```

## `dismiss`

```ts
type dismiss = (key: string) => void;
```

Dismiss a modal by its name/key.

## `dismissAll`

```ts
type dismissAll = () => void;
```

Dismiss all mounted/presented modals.
