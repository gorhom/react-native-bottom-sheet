import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const withGestureHandlerRoot = (Component: FC) => () =>
  (
    <GestureHandlerRootView style={styles.container}>
      <Component />
    </GestureHandlerRootView>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
