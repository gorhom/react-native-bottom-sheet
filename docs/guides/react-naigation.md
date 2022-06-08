---
id: react-navigation-integration
title: React Navigation Integration
description: Bottom Sheet React Navigation integration.
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
slug: /react-navigation-integration
---

One of the main goals of this library, is to allow user to fully integrate a stack navigator in the bottom sheet. This integration allows for a lot of opportunities for a native-like experience in your app 😇

However, there are some tricks that have to be followed to enable both libraries to work together seamlessly.

- You need to override `safeAreaInsets`, by default `React Navigation` add the safe area insets to all its navigators, but since your navigator will probably won't cover full screen, you will need to override it and set it to `0`.

For more details regarding the implementation, please have a look at the [Navigator Example](https://github.com/gorhom/react-native-bottom-sheet/blob/master/example/src/screens/integrations/NavigatorExample.tsx).
