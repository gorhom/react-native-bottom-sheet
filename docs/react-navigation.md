# React Navigation

One of the main goal of this library, is to allow user to fully integrate a navigator in the bottom sheet. This integration allow lots of opportunities for a native-like experience in your app :)

However, there are some tricks has to be follow to enable both libraries to work together seamlessly.

- You need to override `safeAreaInsets`, by default `React Navigation` add the safe area insets to all its navigators, but since your navigator will properly won't cover full screen, you will need to override it and set it to `0`.
- You need to override `headerLeft`, due to bottom sheet wrapping the content with `TapGestureHandler` & `PanGestureHandler`, you will need to wrap the header left button with `TouchableOpacity` that this library provide to allow it working.

For more details regarding the implementation, please have a look at the [Navigator Example](../example/src/screens/NavigatorExample.tsx).