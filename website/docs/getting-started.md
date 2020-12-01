---
id: getting-started
title: Getting Started
description: A performant interactive bottom sheet with fully configurable options 🚀
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
image: /img/preview.gif
hide_title: true
slug: /
hide_table_of_contents: true
---

# React Native Bottom Sheet

[![npm](https://img.shields.io/npm/v/@gorhom/bottom-sheet?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![npm](https://img.shields.io/npm/l/@gorhom/bottom-sheet?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)


A performant interactive bottom sheet with fully configurable options 🚀

![React Native Bottom Sheet](/img/preview.gif)

> Initially, this project was a cloned of `react-native-scroll-bottom-sheet` by [@rgommezz](https://github.com/rgommezz) ❤️. However, it is been fully re-written to add extra functionalities and simplify the approach.

## Features

- 🌟 Modal presentation view, [Bottom Sheet Modal](./modal).
- Smooth gesture interactions & snapping animations.
- Support `FlatList`, `SectionList`, `ScrollView` & `View` scrolling interactions, [read more](./scrollables).
- Support `React Navigation` Integration, [read more](./react-navigation-integration).
- Compatible with `Reanimated v1 & v2`.
- Compatible with `Expo`.
- Written in `TypeScript`.

## Installation

This library provides two versions that are align with `Reanimated v1 & v2`

### Version 2

This version is written with `Reanimated v1` & compatible with `Reanimated v2`:

```bash
yarn add @gorhom/bottom-sheet@2.0.0-alpha.3
```

#### Dependencies

This library needs these dependencies to be installed in your project before you can use it:

```bash
yarn add react-native-reanimated react-native-gesture-handler
```

> ⚠️ **React Native Gesture Handler** needs extra steps to finalize its installation, please follow their [installation instructions](https://github.com/software-mansion/react-native-gesture-handler).
>
> ⚠️ **React Native Reanimated v1** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/1.x.x/getting_started).

### Version 3

This version is written with `Reanimated v2` and **CAN NOT RUN** with `Reanimated v1`:

```bash
yarn add @gorhom/bottom-sheet@3.0.0-alpha.0
```

#### Dependencies

This library needs these dependencies to be installed in your project before you can use it:

```bash
yarn add react-native-reanimated@alpha react-native-gesture-handler
```

> ⚠️ **React Native Gesture Handler** needs extra steps to finalize its installation, please follow their [installation instructions](https://github.com/software-mansion/react-native-gesture-handler).
>
> ⚠️ **React Native Reanimated v2** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/installation).



