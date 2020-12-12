---
id: custom-backdrop
title: Custom Backdrop
slug: /custom-backdrop
hide_table_of_contents: true
---

To add a backdrop to your sheet you will need to pass the prop `backdropComponent` to the `BottomSheet` component.

When you provide your own backdrop component, it will receive these animated props `animatedIndex` & `animatedPosition` that indicates the position and the index of the sheet.

You can extend your custom backdrop props interface with the provided `BottomSheetBackdropProps` interface to expose `animatedIndex` & `animatedPosition` into your own interface.

### Example

Here is an example of a custom backdrop component: 

```tsx
TODO
```
