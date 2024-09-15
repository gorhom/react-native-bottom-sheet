---
id: props
title: Props
description: Bottom Sheet configurable props.
image: /img/bottom-sheet-preview.gif
slug: /props
---

## Configuration

### `index`

Initial snap index. You also could provide `-1` to initiate bottom sheet in closed state.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### `snapPoints`

Points for the bottom sheet to snap to, **points should be sorted from bottom to top**. It accepts array of number, string or mix.

| type                  | required |
| --------------------- | -------- |
| Array\<number\|string> | YES      |

:::caution
String values should be a percentage.
:::

#### examples

```ts
snapPoints={[200, 500]}
snapPoints={[200, '50%']}
snapPoints={[-1, '100%']}
```

### `enableContentPanningGesture`

Enable content panning gesture interaction.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

### `enableHandlePanningGesture`

Enable handle panning gesture interaction.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

### `animateOnMount`

This will initially mount the sheet closed and when it's mounted and calculated the layout, it will snap to initial snap point index.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | false   | NO       |

### `style`

View style to be applied at the sheet container, it also could be an `AnimatedStyle`. This is helpful to add shadow to the sheet.

| type                       | default   | required |
| -------------------------- | --------- | -------- |
| ViewStyle \| AnimatedStyle | undefined | NO       |

## Layout Configuration

### `handleHeight`

Handle height helps to calculate the internal container and sheet layouts. If `handleComponent` is provided, the library internally will calculate its layout, unless `handleHeight` is provided too.

| type   | default | required |
| ------ | ------- | -------- |
| number | 24      | NO       |

### `containerHeight`

Container height helps to calculate the internal sheet layouts. If `containerHeight` not provided, the library internally will calculate it, however this will cause an extra re-rendering.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### `topInset`

Top inset to be added to the bottom sheet container, usually it comes from `@react-navigation/stack` hook `useHeaderHeight` or from `react-native-safe-area-context` hook `useSafeArea`.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### `bottomInset`

Bottom inset to be added to the bottom sheet container.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

## Animation Configuration

### `animationDuration`

Snapping animation duration.

| type   | default | required |
| ------ | ------- | -------- |
| number | 500     | NO       |

### `animationEasing`

Snapping animation easing function.

| type             | default | required |
| ---------------- | ------- | -------- |
| `EasingFunction` | @TODO   | NO       |

## Animated Nodes

### `animatedIndex`

Animated value to be used as a callback for the index node internally.

| type                   | default | required |
| ---------------------- | ------- | -------- |
| AnimatedValue\<number\> | null    | NO       |

### `animatedPosition`

Animated value to be used as a callback for the position node internally.

| type                   | default | required |
| ---------------------- | ------- | -------- |
| AnimatedValue\<number\> | null    | NO       |

## Callbacks

### `onChange`

Callback when the sheet position changed.

```ts
type onChange = (index: number) => void;
```

| type     | default | required |
| -------- | ------- | -------- |
| function | null    | NO       |

### `onAnimate`

Callback when the sheet about to animate to a new position.

```ts
type onAnimate = (fromIndex: number, toIndex: number) => void;
```

| type     | default | required |
| -------- | ------- | -------- |
| function | null    | NO       |

## Components

### `handleComponent`

Component to be placed as a sheet handle.

| type                               | default             | required |
| ---------------------------------- | ------------------- | -------- |
| `React.FC<BottomSheetHandleProps>` | `BottomSheetHandle` | NO       |

### `backdropComponent`

Component to be placed as a sheet backdrop, by default is set to `null`, however the library also provide a default implementation `BottomSheetBackdrop` of a backdrop but you will need to provide it manually.

| type                                   | default | required |
| -------------------------------------- | ------- | -------- |
| `React.FC<BottomSheetBackgroundProps>` | null    | NO       |

### `backgroundComponent`

Component to be placed as a sheet background.

| type                                   | default                 | required |
| -------------------------------------- | ----------------------- | -------- |
| `React.FC<BottomSheetBackgroundProps>` | `BottomSheetBackground` | NO       |

### `children`

`Scrollable` node or react node to be places as a sheet content.

| type                                                          | default | required |
| ------------------------------------------------------------- | ------- | -------- |
| () => React.ReactNode \| React.ReactNode[] \| React.ReactNode | null    | YES      |
