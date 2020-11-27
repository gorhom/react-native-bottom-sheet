---
id: hooks
title: Hooks
slug: /hooks
hide_table_of_contents: true
---

## `useBottomSheet`

This hook provides all the bottom sheet public [methods](methods), to the internal sheet content or handle.

```tsx
import { useBottomSheet} from '@gorhom/bottom-sheet';

const SheetContent = () => {
  const { expand } = useBottomSheet();

  return (
    <View>
      <Button onPress={expand}>
    </View>
  )
}
```
