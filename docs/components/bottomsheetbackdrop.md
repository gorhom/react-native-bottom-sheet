---
id: bottomsheetbackdrop
title: BottomSheetBackdrop
description: a pre-built BottomSheet backdrop implementation with configurable props.
image: /img/bottom-sheet-preview.gif
slug: /components/bottomsheetbackdrop
---

A pre-built BottomSheet backdrop implementation with configurable props.

// TODO add preview

## Props

Inherits `ViewProps` from `react-native`.

### `animatedIndex`

Current sheet position index.

| type                          | default | required |
| ----------------------------- | ------- | -------- |
| Animated.SharedValue<number\> | 0       | YES      |

### `animatedPosition`

Current sheet position.

| type                          | default | required |
| ----------------------------- | ------- | -------- |
| Animated.SharedValue<number\> | 0       | YES      |

### `opacity`

Backdrop opacity.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0.5     | NO       |

### `appearsOnIndex`

Snap point index when backdrop will appears on.

| type   | default | required |
| ------ | ------- | -------- |
| number | 1       | NO       |

### `disappearsOnIndex`

Snap point index when backdrop will disappears on.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### `enableTouchThrough`

Enable touch through backdrop component.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | false   | NO       |

### `pressBehavior`

What should happen when user press backdrop?

- `none`: do nothing.
- `close`: close the sheet.
- `collapse`: collapse the sheet.
- `N`: snap point index.

| type                              | default | required |
| --------------------------------- | ------- | -------- |
| `BackdropPressBehavior` \| number | 'close' | NO       |

## Example

```tsx
// TODO
```
