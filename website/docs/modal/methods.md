---
id: methods
title: Methods
slug: /modal/methods
hide_table_of_contents: true
---


**Bottom Sheet Modal** inherits all [**Bottom Sheet** methods](../methods) and also it introduces its own methods.

These methods are accessible using the bottom sheet modal reference:

```tsx
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const App = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const present = () => bottomSheetModalRef.current.present()

  return (
    <BottomSheetModal ref={bottomSheetModalRef}>
  )
}

```

### `present`

```ts
type present = () => void;
```

Mount and present the modal.

### `dismiss`

```ts
type dismiss = () => void;
```

Close and unmount the modal.
