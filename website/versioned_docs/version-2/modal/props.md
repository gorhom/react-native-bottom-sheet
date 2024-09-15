---
id: props
title: Props
description: Bottom Sheet modal configurable props.
image: /img/bottom-sheet-preview.gif
slug: /modal/props
---

**Bottom Sheet Modal** inherits all [**Bottom Sheet** props](../props) except for `animateOnMount` & `containerHeight` and also it introduces its own props:

## Configuration

### `name`

Modal name to help identify the modal for later on.

| type   | default                | required |
| ------ | ---------------------- | -------- |
| string | `generated unique key` | NO       |

### `dismissOnPanDown`

Dismiss modal when panning down.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | NO       |

## Callbacks

### `onDismiss`

Callback when the modal dismissed.

```ts
type onDismiss = () => void;
```

| type     | default | required |
| -------- | ------- | -------- |
| function | null    | NO       |
