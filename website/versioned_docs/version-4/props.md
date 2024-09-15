---
id: props
title: Props
description: Bottom Sheet configurable props.
image: /img/bottom-sheet-preview.gif
slug: /props
---

## Configuration

### index

Initial snap index. You also could provide `-1` to initiate bottom sheet in closed state.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### snapPoints

Points for the bottom sheet to snap to, **points should be sorted from bottom to top**. It accepts array of number, string or mix.

| type                                                          | required |
| ------------------------------------------------------------- | -------- |
| Array\<number\|string> \| SharedValue\<Array\<string \| number>> | YES\*    |

:::caution
This prop is required unless you set `enableDynamicSizing` to `true`.
:::
:::caution
String values should be a percentage.
:::

#### examples

```ts
snapPoints={[200, 500]}
snapPoints={[200, '50%']}
snapPoints={['100%']}
```

### overDragResistanceFactor

Defines how violently sheet has to be stopped while over dragging.

| type   | default | required |
| ------ | ------- | -------- |
| number | 2.5     | NO       |

### detached

Defines whether the bottom sheet is attached to the bottom or no.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | false   | NO       |

### enableContentPanningGesture

Enable content panning gesture interaction.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

### enableHandlePanningGesture

Enable handle panning gesture interaction.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

### enableOverDrag

Enable over drag for the sheet.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

### enablePanDownToClose

Enable pan down gesture to close the sheet.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | false   | NO       |

### enableDynamicSizing

Enable dynamic sizing for content view and scrollable content size.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | false   | NO       |

:::caution

Setting this prop to `true`, will result in adding a new snap point to the provided snap points and will be sorted accordingly, and this might effect the indexing, for example, if provided snap points are `[100, 1000]`, and the content size is `500` then the final snap points will be `[100, 500, 1000]`.

:::

### animateOnMount

This will initially mount the sheet closed and when it's mounted and calculated the layout, it will snap to initial snap point index.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

## Styles

### style

View style to be applied at the sheet container, it also could be an `AnimatedStyle`. This is helpful to add shadow to the sheet.

| type                       | default   | required |
| -------------------------- | --------- | -------- |
| ViewStyle \| AnimatedStyle | undefined | NO       |

### backgroundStyle

View style to be applied to the background component.

| type      | default   | required |
| --------- | --------- | -------- |
| ViewStyle | undefined | NO       |

### handleStyle

View style to be applied to the handle component.

| type      | default   | required |
| --------- | --------- | -------- |
| ViewStyle | undefined | NO       |

### handleIndicatorStyle

View style to be applied to the handle indicator component.

| type      | default   | required |
| --------- | --------- | -------- |
| ViewStyle | undefined | NO       |

## Layout Configuration

### handleHeight

Handle height helps to calculate the internal container and sheet layouts. If `handleComponent` is provided, the library internally will calculate its layout, unless `handleHeight` is provided too.

| type   | default | required |
| ------ | ------- | -------- |
| number | 24      | NO       |

### containerHeight

Container height helps to calculate the internal sheet layouts. If `containerHeight` not provided, the library internally will calculate it, however this will cause an extra re-rendering.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### contentHeight

Content height helps dynamic snap points calculation.

| type                                    | default   | required |
| --------------------------------------- | --------- | -------- |
| number \| Animated.SharedValue\<number\> | undefined | NO       |

### containerOffset

Container offset helps to accurately detect container offsets.

| type                          | default   | required |
| ----------------------------- | --------- | -------- |
| Animated.SharedValue\<Insets\> | undefined | NO       |

### topInset

Top inset to be added to the bottom sheet container, usually it comes from `@react-navigation/stack` hook `useHeaderHeight` or from `react-native-safe-area-context` hook `useSafeArea`.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### bottomInset

Bottom inset to be added to the bottom sheet container.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### maxDynamicContentSize

Max dynamic content size height to limit the bottom sheet height from exceeding a provided size.

| type   | default          | required |
| ------ | ---------------- | -------- |
| number | container height | NO       |

## Keyboard Configuration

### keyboardBehavior

Defines the keyboard appearance behavior.

- `extend`: extend the sheet to its maximum snap point.
- `fillParent`: extend the sheet to fill the parent view.
- `interactive`: offset the sheet by the size of the keyboard.

| type                                      | default       | required |
| ----------------------------------------- | ------------- | -------- |
| 'extend' \| 'fillParent' \| 'interactive' | 'interactive' | NO       |

### keyboardBlurBehavior

Defines the keyboard blur behavior.

- `none`: do nothing.
- `restore`: restore sheet position.

| type                | default | required |
| ------------------- | ------- | -------- |
| 'none' \| 'restore' | 'none'  | NO       |

### android_keyboardInputMode

Defines keyboard input mode for `Android` only, [learn more](https://developer.android.com/guide/topics/manifest/activity-element#wsoft).

| type                          | default     | required |
| ----------------------------- | ----------- | -------- |
| 'adjustPan' \| 'adjustResize' | 'adjustPan' | NO       |

## Animation Configuration

### animationConfigs

Animation configs, this could be created by:

- [`useBottomSheetSpringConfigs`](./hooks#usebottomsheetspringconfigs)
- [`useBottomSheetTimingConfigs`](./hooks#usebottomsheettimingconfigs)

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

## Gesture Configuration

### waitFor

[Read about `waitFor`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-common#waitfor).

| type                     | default | required |
| ------------------------ | ------- | -------- |
| React.Ref \| React.Ref[] | []      | NO       |

### simultaneousHandlers

[Read about `simultaneousHandlers`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-common#simultaneoushandlers).

| type                     | default | required |
| ------------------------ | ------- | -------- |
| React.Ref \| React.Ref[] | []      | NO       |

### activeOffsetX

[Read about `activeOffsetX`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan#activeoffsetx).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

### activeOffsetY

[Read about `activeOffsetY`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan#activeoffsety).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

### failOffsetX

[Read about `failOffsetX`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan/#failoffsetx).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

### failOffsetY

[Read about `failOffsetY`](https://docs.swmansion.com/react-native-gesture-handler/docs/handler-pan/#failoffsety).

| type     | default   | required |
| -------- | --------- | -------- |
| number[] | undefined | NO       |

### gestureEventsHandlersHook

Custom hook to provide pan gesture events handler, which will allow advance and customize handling for pan gesture.

| type                          | default                         | required |
| ----------------------------- | ------------------------------- | -------- |
| GestureEventsHandlersHookType | useGestureEventsHandlersDefault | NO       |

> warning: this is an experimental feature and the hook signature can change without a major version bump.

## Animated Nodes

### animatedIndex

Animated value to be used as a callback for the index node internally.

| type                          | default | required |
| ----------------------------- | ------- | -------- |
| Animated.SharedValue\<number\> | null    | NO       |

### animatedPosition

Animated value to be used as a callback for the position node internally.

| type                          | default | required |
| ----------------------------- | ------- | -------- |
| Animated.SharedValue\<number\> | null    | NO       |

## Callbacks

### onChange

Callback when the sheet position changed.

```ts
type onChange = (index: number) => void;
```

| type     | default | required |
| -------- | ------- | -------- |
| function | null    | NO       |

### onAnimate

Callback when the sheet about to animate to a new position.

```ts
type onAnimate = (fromIndex: number, toIndex: number) => void;
```

| type     | default | required |
| -------- | ------- | -------- |
| function | null    | NO       |

## Components

### handleComponent

Component to be placed as a sheet handle.

| type                               | default             | required |
| ---------------------------------- | ------------------- | -------- |
| `React.FC\<BottomSheetHandleProps>` | `BottomSheetHandle` | NO       |

### backdropComponent

Component to be placed as a sheet backdrop, by default is set to `null`, however the library also provide a default implementation `BottomSheetBackdrop` of a backdrop but you will need to provide it manually.

| type                                   | default | required |
| -------------------------------------- | ------- | -------- |
| `React.FC\<BottomSheetBackgroundProps>` | null    | NO       |

### backgroundComponent

Component to be placed as a sheet background.

| type                                   | default                 | required |
| -------------------------------------- | ----------------------- | -------- |
| `React.FC\<BottomSheetBackgroundProps>` | `BottomSheetBackground` | NO       |

### footerComponent

Component to be placed as a sheet footer.

| type                               | default   | required |
| ---------------------------------- | --------- | -------- |
| `React.FC\<BottomSheetFooterProps>` | undefined | NO       |

### children

`Scrollable` node or react node to be places as a sheet content.

| type                                                          | default | required |
| ------------------------------------------------------------- | ------- | -------- |
| () => React.ReactNode \| React.ReactNode[] \| React.ReactNode | null    | YES      |
