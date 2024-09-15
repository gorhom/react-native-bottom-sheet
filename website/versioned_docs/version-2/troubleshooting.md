---
id: troubleshooting
title: Troubleshooting
description: Bottom Sheet troubleshooting.
image: /img/bottom-sheet-preview.gif
slug: /troubleshooting
hide_table_of_contents: true
---

This section attempts to outline issues that users frequently encounter when first getting accustomed to using React Native Bottom Sheet. These issues may or may not be related to React Native Bottom Sheet itself.

## Pressables / Touchables are not working on Android

Due to wrapping the content and handle with `TapGestureHandler` & `PanGestureHandler`, any gesture interaction would not function as expected.

To resolve this issue, please use touchables that this library provide.

```tsx
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet';
```

## Adding horizontal FlatList or ScrollView is not working properly on Android

Due to wrapping the content and handle with `TapGestureHandler` & `PanGestureHandler`, any gesture interaction would not function as expected.

To resolve this issue, please use `ScrollView` & `FlatList` from `react-native-gesture-handler` provide instead `react-native`.

```tsx
import {
  ScrollView,
  FlatList
} from 'react-native-gesture-handler';
```

## My component gesture interaction gets conflicted with Bottom Sheet interactions ?

To avoid the gesture interaction conflict between the Bottom Sheet and its content, you will need to wrap your component with `NativeViewGestureHandler` from `react-native-gesture-handler`

```tsx
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

<NativeViewGestureHandler disallowInterruption={true}>
   <AwesomeComponent />
</NativeViewGestureHandler>
```
