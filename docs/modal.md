# Bottom Sheet Modal

With the release of the library, support for stack sheet modals were something planned ahead to provide the a native feel & and experience to users.

The implementation of this feature was inspired by Apple Maps sheet modals ❤️, [check out the Apple Map sheet modals clone](../example/src/screens/advanced/MapExample.tsx).

## Features

- Smooth interaction and mounting animation.
- Support stack sheet modals.

## Hooks

### `useBottomSheetModal`

This hook to provides the bottom sheet modal:

#### `present`

Present a scrollable view that it will be wrapped with Bottom Sheet, and provide the bottom sheet view & modal props in the configs parameter.

> `type:` (content: ReactNode, configs: [BottomSheetModalConfigs](#bottom-sheet-modal-configs)) => void

#### `dismiss`

Dismiss the presented sheet modal.

> `type:` () => void

#### `dismissAll`

Dismiss all presented sheet modals.

> `type:` () => void

#### `snapTo`

Snap to one of the provided points from `snapPoints`.

> `type:` (index: number) => void

#### `expand`

Snap to the maximum provided point from `snapPoints`.

> `type:` () => void

#### `collapse`

Snap to the minimum provided point from `snapPoints`.

> `type:` () => void

## Bottom Sheet Modal Configs

This will also include [BottomSheetProps](../README.md#props).

#### `allowTouchThroughOverlay`

Allow touch through overlay component.

> `required:` NO | `type:` boolean | `default:` false

#### `overlayComponent`

Overlay component.

> `required:` NO | `type:` React.FC<[BottomSheetOverlayProps](../src/components/overlay/types.d.ts)>

#### `overlayOpacity`

Overlay opacity.

> `required:` NO | `type:` number | `default:` 0.5

#### `dismissOnOverlayPress`

Dismiss modal when press on overlay.

> `required:` NO | `type:` boolean | `default:` true

#### `dismissOnScrollDown`

Dismiss modal when scroll down.

> `required:` NO | `type:` boolean | `default:` true

## Example

```tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import {
  BottomSheetModalProvider,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';

const App = () => {
  // hooks
  const { present, dismiss } = useBottomSheetModal();

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handlePresentPress = useCallback(() => {
    present(
      {
        /* INSERT A SCROLLABLE HERE */
      },
      {
        snapPoints: snapPoints,
        onChange: handleSheetChanges,
      }
    );
  }, [present, snapPoints, handleSheetChanges]);

  const handleDismissPress = useCallback(() => {
    dismiss();
  }, [dismiss]);

  // renders
  return (
    <View style={styles.container}>
      <Button onPress={handlePresentPress} title="Present Modal" />
      <Button onPress={handleDismissPress} title="Dismiss Modal" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

export default () => (
  <BottomSheetModalProvider>
    <App />
  </BottomSheetModalProvider>
);
```
