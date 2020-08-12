<div align="center">
<h1>Bottom Sheet</h1>

[![npm](https://img.shields.io/npm/v/@gorhom/bottom-sheet?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![npm](https://img.shields.io/npm/l/@gorhom/bottom-sheet?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet)

<img src="./preview.gif">

A performant interactive bottom sheet with fully configurable options 🚀

</div>

> Initially, this project was a cloned of `react-native-scroll-bottom-sheet` by [@rgommezz](https://github.com/rgommezz) ❤️. However, it is been fully re-written to add extra functionalities and simplify the approach.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
   - [Custom Handle](./docs/custom-handle.md)
   - [React Navigation Integration](./docs/react-navigation.md)
   - [Touchables](./docs/touchables.md)
4. [Props](#props)
5. [Methods](#methods)
6. [Hooks](#hooks)
7. [Scrollables](#scrollables)
   - [BottomSheetFlatList](./docs/flatlist.md)
   - [BottomSheetSectionList](./docs/sectionlist.md)
   - [BottomSheetScrollView](./docs/scrollview.md)
   - [BottomSheetView](./docs/flatlist.md)
8. [To Do](#to-do)
9. [FAQ](#faq)
10. [Credits](#built-with)
11. [License](#license)

## Features

- Smooth interactions & snapping animations.
- Support `FlatList`, `SectionList`, `ScrollView` & `View` scrolling interactions.
- Support `React Navigation` Integration.
- Written in `TypeScript`.

## Installation

```sh
yarn add @gorhom/bottom-sheet
# or
npm install @gorhom/bottom-sheet
```

> ⚠️ You need to install [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) & [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler) and follow their installation instructions.

## Usage

```tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const App = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        initialSnapIndex={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        {/* INSERT A SCROLLABLE HERE */}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

export default App;
```

## Props

#### `initialSnapIndex`

Initial snap index. You also could provide {`-1`} to initiate bottom sheet in closed state.

> `required:` NO | `type:` number | `default:` 0

#### `snapPoints`

Points for the bottom sheet to snap to, `points should be sorted from bottom to top`. It accepts array of number, string or mix. String values should be a percentage.

> `required:` YES | `type:` Array<string | number> <br> `example:` [100, '50%', '90%']

#### `topInset`

Top inset value helps to calculate percentage snap points values. usually comes from `@react-navigation/stack` hook `useHeaderHeight` or from `react-native-safe-area-context` hook `useSafeArea`.

> `required:` NO | `type:` number | `default:` 0

#### `animationDuration`

Snapping animation duration.

> `required:` NO | `type:` number | `default:` 500

#### `animationEasing`

Snapping animation easing function.

> `required:` NO | `type:` Animated.EasingFunction | `default:` Easing.out(Easing.back(0.75))

#### `animatedPosition`

Animated value to be used as a callback for the position node internally.

> `required:` NO | `type:` Animated.Value<number>

#### `animatedPositionIndex`

Animated value to be used as a callback for the position index node internally.

> `required:` NO | `type:` Animated.Value<number>

#### `handleComponent`

Component to be placed as a sheet handle.

> `required:` NO | `type:` React.FC<[BottomSheetHandleProps](./src/components/handle/types.d.ts)>

#### `backgroundComponent`

Component to be placed as a background.

> `required:` NO | `type:` React.FC<ViewProps>

#### `onChange`

Callback when sheet position changed to a provided point.

> `required:` NO | `type:` (index: number) => void

#### `children`

A scrollable node or normal view.

> `required:` YES | `type:` React.ReactNode[] | React.ReactNode

## Methods

#### `snapTo`

Snap to one of the provided points from `snapPoints`.

> `type:` (index: number) => void

#### `expand`

Snap to the maximum provided point from `snapPoints`.

> `type:` () => void

#### `collapse`

Snap to the minimum provided point from `snapPoints`.

> `type:` () => void

#### `close`

Close the bottom sheet.

> `type:` () => void

## Hooks

#### `useBottomSheet`

The library provide `useBottomSheet` hook to provide the bottom sheet [methods](#methods), anywhere inside the sheet content.

> `type:` [BottomSheetMethods](./src/types.ts#L3)

## Scrollables

This library provides a pre-integrated views that utilise an internal functionalities with the bottom sheet to allow smooth interactions. These views i called them `Scrollables` and they are:

- [BottomSheetFlatList](./docs/flatlist.md)
- [BottomSheetSectionList](./docs/sectionlist.md)
- [BottomSheetScrollView](./docs/scrollview.md)
- [BottomSheetView](./docs/flatlist.md)

## To Do

- [ ] Add tablets support.
- [ ] Add Reanimated v2 support.

## FAQ

#### How this library differ from `reanimated-bottom-sheet` or `react-native-scroll-bottom-sheet`?

> This library was built to provide the most native-like experience and could fit any use-case that developers wants it to be.
>
> While both libraries providing similar experience, but they still missing the following:
>
> - `reanimated-bottom-sheet`
>   - Seamless gesture interaction between the sheet and the content.
> - `react-native-scroll-bottom-sheet`
>   - Extracting scrollable content to allow developers customize the sheet content, like integrate `React Navigation` as the sheet >content.
>
> Both libraries are great! and I have used both of them at my work ❤️

#### How can I integrate `React Navigation`?

> here you go [React Navigation Integration](./docs/react-navigation.md) :)

#### Will this library support `Reanimated v2`?

> Sure! check out the [Feature Board](https://github.com/gorhom/react-native-bottom-sheet/projects/1)

<h2 id="built-with">Built With ❤️</h2>

- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)
- [react-native-redash](https://github.com/wcandillon/react-native-redash)
- [@react-native-community/bob](https://github.com/react-native-community/bob)

## Author

- [Mo Gorhom](https://gorhom.dev/)

## License

MIT

<div align="center">

Liked the library? 😇

<a href="https://www.buymeacoffee.com/gorhom" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-red.png" alt="Buy Me A Coffee" height="50" ></a>

</div>

---

<p align="center">
<a href="https://gorhom.dev" target="_blank"><img alt="Mo Gorhom" src="./logo.png"></a>
</p>
