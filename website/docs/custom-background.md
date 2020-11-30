---
id: custom-background
title: Custom Background
slug: /custom-background
hide_table_of_contents: true
---

To override the default background, you will need to pass the prop `backgroundComponent` to the `BottomSheet` component.

When you provide your own background component, it will receive an animated prop `animatedIndex` & `animatedPosition` that indicates the index of the current position of the sheet.

You can extend your custom handle props interface with the provided `BottomSheetBackgroundProps` interface to expose `animatedIndex` & `animatedPosition` into your props.

### Example

Here is an example of a custom background component: 

```tsx
TODO
```
