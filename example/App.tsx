import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Main from './src/Main';

import { enableScreens } from 'react-native-screens';
enableScreens(true);

// @ts-ignore
import { enableLogging } from '@gorhom/bottom-sheet';
enableLogging();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Main />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
