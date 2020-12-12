---
id: custom-background
title: Custom Background
slug: /custom-background
hide_table_of_contents: true
---

To override the default background, you will need to pass the prop `backgroundComponent` to the `BottomSheet` component.

When you provide your own background component, it will receive these animated props `animatedIndex` & `animatedPosition` that indicates the position and the index of the sheet.

You can extend your custom background props interface with the provided `BottomSheetBackgroundProps` interface to expose `animatedIndex` & `animatedPosition` into your own interface.

### Example

Here is an example of a custom background component: 

```tsx
TODO
```
