---
id: props
title: Props
slug: /props
# hide_table_of_contents: true
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
| Array<number\|string> | YES      |

:::caution
String values should be a percentage.
:::

#### examples

```ts
snapPoints={[200, 500]}
snapPoints={[200, '50%']}
snapPoints={[-1, '100%']}
```

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

### `overDragResistanceFactor`

**`Available only on v3, for now.`**

Defines how violently sheet has to stopped while over dragging.

| type   | default | required |
| ------ | ------- | -------- |
| number | 2.5     | NO       |

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

### `enableOverDrag`

**`Available only on v3, for now.`**

Enable over drag for the sheet.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

### `enableFlashScrollableIndicatorOnExpand`

**`Available only on v3, for now.`**

Enable flash the scrollable indicator when the sheet is expanded.

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

## Animation Configuration

### `animationConfigs`

**`Available only on v3, for now.`**

Animation configs, this could be created by:

- `useBottomSheetSpringConfigs`
- `useBottomSheetTimingConfigs`

```ts
type animationConfigs = (
  point: number,
  velocity: number,
  callback: () => void
) => number;
```

| type     | default   | required |
| -------- | --------- | -------- |
| function | undefined | NO       |

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

## Gesture Configuration

### `waitFor`

**`Available only on v3, for now.`**

[Read about `waitFor`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-common#waitfor).

| type                     | default | required |
| ------------------------ | ------- | -------- |
| React.Ref \| React.Ref[] | []      | NO       |

### `simultaneousHandlers`

**`Available only on v3, for now.`**

[Read about `simultaneousHandlers`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-common#simultaneoushandlers).

| type                     | default | required |
| ------------------------ | ------- | -------- |
| React.Ref \| React.Ref[] | []      | NO       |

### `activeOffsetX`

**`Available only on v3, for now.`**

[Read about `activeOffsetX`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan#activeoffsetx).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

### `activeOffsetY`

**`Available only on v3, for now.`**

[Read about `activeOffsetY`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan#activeoffsety).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

### `failOffsetX`

**`Available only on v3, for now.`**

[Read about `failOffsetX`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan/#failoffsetx).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

### `failOffsetY`

**`Available only on v3, for now.`**

[Read about `failOffsetY`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan/#failoffsety).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

## Animated Nodes

### `animatedIndex`

Animated value to be used as a callback for the index node internally.

| type                   | default | required |
| ---------------------- | ------- | -------- |
| AnimatedValue<number\> | null    | NO       |

### `animatedPosition`

Animated value to be used as a callback for the position node internally.

| type                   | default | required |
| ---------------------- | ------- | -------- |
| AnimatedValue<number\> | null    | NO       |

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
