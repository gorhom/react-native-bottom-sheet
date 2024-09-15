---
id: hooks
title: Hooks
description: Bottom Sheet hooks.
image: /img/bottom-sheet-preview.gif
slug: /hooks
---

## useBottomSheet

This hook provides all the bottom sheet public [methods](methods) and `animatedIndex` & `animatedPosition`, to the internal sheet content or handle.

:::info

This hook works at any component inside the `BottomSheet`.

:::

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useBottomSheet } from '@gorhom/bottom-sheet';

const SheetContent = () => {
  const { expand } = useBottomSheet();

  return (
    <View>
      <Button onPress={expand}>
    </View>
  )
}
```

## useBottomSheetDynamicSnapPoints

A hook to simplify handling dynamic snap points, it will take an initial snap points with a placeholder for content height `CONTENT_HEIGHT` that will be replaced once the content is measured and will return:

- `animatedSnapPoints`: to provided to BottomSheet or BottomSheetModal.
- `animatedHandleHeight`: an animated handle height callback node.
- `animatedContentHeight`: an animated content height.
- `handleContentLayout`: onLayout callback to be set on BottomSheetView component.

```tsx
import React from 'react';
import BottomSheet, {
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';

const App = () => {
  const initialSnapPoints = useMemo(() => ['25%', 'CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    //... other views
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
    >
      <BottomSheetView
        style={contentContainerStyle}
        onLayout={handleContentLayout}
      >
        //... views to be measured
      </BottomSheetView>
    </BottomSheet>
    //... other views
  );
};
```

## useBottomSheetSpringConfigs

Generate animation spring configs.

```tsx
import React from 'react';
import BottomSheet, { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

const SheetContent = () => {

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  return (
    <BottomSheet
      // ... other props
      animationConfigs={animationConfigs}
    >
      {CONTENT HERE}
    </BottomSheet>
  )
}
```

## useBottomSheetTimingConfigs

Generate animation timing configs.

```tsx
import React from 'react';
import BottomSheet, { useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { Easing } from 'react-native-reanimated';

const SheetContent = () => {

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.exp,
  });

  return (
    <BottomSheet
      // ... other props
      animationConfigs={animationConfigs}
    >
      {CONTENT HERE}
    </BottomSheet>
  )
}
```
