---
id: methods
title: Methods
description: Bottom Sheet modal methods.
image: /img/bottom-sheet-preview.gif
slug: /modal/methods
---

**Bottom Sheet Modal** inherits all [**Bottom Sheet** methods](../methods) and also it introduces its own methods.

These methods are accessible using the bottom sheet modal reference:

```tsx
import React, { useRef } from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const App = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentPress = () => bottomSheetModalRef.current.present()
  return (
    <>
      <Button title="Present Sheet" onPress={handlePresentPress} />
      <BottomSheetModal ref={bottomSheetModalRef}>
    </>
  )
}

```

### present

Mount and present the bottom sheet modal to the initial snap point.

```ts
type present = (
  // Data to be passed to the modal.
  data?: any
) => void;
```

### dismiss

Close and unmount the bottom sheet modal.

```ts
type dismiss = (
  // AnimationConfigs snap animation configs.
  animationConfigs?: WithSpringConfig | WithTimingConfig
) => void;
```
