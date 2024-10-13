---
id: index
title: Bottom Sheet
hide_title: true
sidebar_label: Bottom Sheet
description: A performant interactive bottom sheet with fully configurable options 🚀
image: /img/bottom-sheet-preview.gif
slug: /
---

<head>
  <title>React Native Bottom Sheet</title>
</head>

# React Native Bottom Sheet

[![Reanimated v3 version](https://img.shields.io/github/package-json/v/gorhom/react-native-bottom-sheet/master?label=Reanimated%20v3&style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![Reanimated v2 version](https://img.shields.io/github/package-json/v/gorhom/react-native-bottom-sheet/v4?label=Reanimated%20v2&style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet)  [![Reanimated v1 version](https://img.shields.io/github/package-json/v/gorhom/react-native-bottom-sheet/v2?label=Reanimated%20v1&style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet)<br />
[![license](https://img.shields.io/npm/l/@gorhom/bottom-sheet?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![npm](https://img.shields.io/badge/types-included-blue?style=flat-square)](https://www.npmjs.com/package/@gorhom/bottom-sheet) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/) <br /> ![NPM Downloads](https://img.shields.io/npm/dw/%40gorhom%2Fbottom-sheet?style=flat-square)

A performant interactive bottom sheet with fully configurable options 🚀

import useBaseUrl from "@docusaurus/useBaseUrl";
import Video from "@theme/Video";

<Video
	title="React Native Bottom Sheet"
	url={useBaseUrl("video/bottom-sheet-preview.mp4")}
	img={useBaseUrl("img/bottom-sheet-preview.gif")}
/>

## Features

- ⭐️ Support React Native Web, [read more](./web-support).
- ⭐️ Dynamic Sizing, [read more](./dynamic-sizing).
- ⭐️ Support FlashList, [read more](./components/bottomsheetflashlist).
- Modal presentation view, [Bottom Sheet Modal](./modal).
- Smooth gesture interactions & snapping animations.
- Seamless [keyboard handling](./keyboard-handling) for iOS & Android.
- Support [pull to refresh](./pull-to-refresh) for scrollables.
- Support `FlatList`, `SectionList`, `ScrollView` & `View` scrolling interactions, [read more](./scrollables).
- Support `React Navigation` Integration, [read more](./react-navigation-integration).
- Compatible with `Reanimated` v1-3.
- Accessibility support.
- Written in `TypeScript`.

## Installation

```bash
yarn add @gorhom/bottom-sheet@^5
```

#### Dependencies

This library needs these dependencies to be installed in your project before you can use it:

```bash
yarn add react-native-reanimated react-native-gesture-handler
```

Using Expo?

```bash
npx expo install react-native-reanimated react-native-gesture-handler
```

:::info
**React Native Gesture Handler v3** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation). Please **make sure** to wrap your App with `GestureHandlerRootView` when you've upgraded to React Native Gesture Handler ^3.

**React Native Reanimated v3** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).
:::

## Sponsor & Support

To keep this library maintained and up-to-date please consider [sponsoring it on GitHub](https://github.com/sponsors/gorhom). Or if you are looking for a private support or help in customizing the experience, then reach out to me on Twitter [@gorhom](https://twitter.com/gorhom).

## Built With ❤️

- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)
- [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)
