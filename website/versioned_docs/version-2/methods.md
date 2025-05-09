---
id: methods
title: Methods
description: Bottom Sheet methods.
image: /img/bottom-sheet-preview.gif
slug: /methods
---

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
type snapTo = (index: number) => void;
```

### `expand`

Animate the sheet to the highest provided point from `snapPoints`.

```ts
type expand = () => void;
```

### `collapse`

Animate the sheet to the lowest provided point from `snapPoints`.

```ts
type collapse = () => void;
```

### `close`

Close the sheet.

```ts
type close = () => void;
```
