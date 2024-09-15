---
id: react-navigation-integration
title: React Navigation Integration
description: Bottom Sheet React Navigation integration.
image: /img/bottom-sheet-preview.gif
slug: /react-navigation-integration
hide_table_of_contents: true
---

One of the main goal of this library, is to allow user to fully integrate a stack navigator in the bottom sheet. This integration allow lots of opportunities for a native-like experience in your app 😇

However, there are some tricks has to be follow to enable both libraries to work together seamlessly.

- You need to override `safeAreaInsets`, by default `React Navigation` add the safe area insets to all its navigators, but since your navigator will properly won't cover full screen, you will need to override it and set it to `0`.

For more details regarding the implementation, please have a look at the [Navigator Example](https://github.com/gorhom/react-native-bottom-sheet/blob/master/example/bare/src/screens/integrations/NavigatorExample.tsx).
