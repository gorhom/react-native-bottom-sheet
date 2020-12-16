---
id: troubleshooting
title: Troubleshooting
slug: /troubleshooting
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
