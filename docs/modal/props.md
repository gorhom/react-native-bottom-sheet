---
id: props
title: Props
description: Bottom Sheet modal configurable props.
keywords:
  - bottomsheet
  - bottom-sheet
  - bottom sheet
  - react-native
  - react native
  - ios
  - android
  - sheet
  - modal
  - presentation modal
  - reanimated
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

### `stackBehavior`

**`Available only on v3, for now.`**

Defines the stack behavior when modal mounts.

- `push` it will mount the modal on top of current modal.
- `replace` it will minimize the current modal then mount the modal.

| type                | default   | required |
| ------------------- | --------- | -------- |
| 'push' \| 'replace' | 'replace' | NO       |

### `enableDismissOnClose`

Dismiss the modal when it is closed

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
