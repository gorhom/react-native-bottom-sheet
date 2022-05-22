import React from 'react';
// import { screens } from './screens';
import { App } from '@gorhom/bottom-sheet-example-app';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default () => (
  <GestureHandlerRootView style={styles.container}>
    <App />
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
