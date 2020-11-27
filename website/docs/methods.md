---
id: methods
title: Methods
slug: /methods
hide_table_of_contents: true
---

These methods are accessable using the bottom sheet reference.

```tsx
import BottomSheet from '@gorhom/bottom-sheet';

const App = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const close = () => bottomSheetRef.current.close()

  return (
    <BottomSheet ref={bottomSheetRef}>
  )
}

```

### `snapTo`

```ts
type snapTo = (index: number) => void;
```

Animate the sheet to one of the provided point from `snapPoints`.

### `expand`

```ts
type expand = () => void;
```

Animate the sheet to the maximum provided point from `snapPoints`.

### `collapse`

```ts
type collapse = () => void;
```

Animate the sheet to the minimum provided point from `snapPoints`.

### `close`

```ts
type close = () => void;
```

Close the sheet.
